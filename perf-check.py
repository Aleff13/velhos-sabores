#!/usr/bin/env python3
"""
perf-check.py — Análise de performance da página Velhos Sabores

Uso:
    python3 perf-check.py           # inicia servidor e mede tudo
    python3 perf-check.py --port N  # porta customizada (padrão: 8732)
    python3 perf-check.py --no-cdn  # pula medição das dependências CDN externas

Compara os resultados a cada execução para mostrar delta de melhora.
"""

import subprocess, time, sys, json, os, signal, re, argparse, socket
from pathlib import Path
from urllib.parse import urlparse

# ── Config ────────────────────────────────────────────────────────────────────
ROOT    = Path(__file__).parent
HISTORY = ROOT / ".perf-history.json"

# ── CLI args ──────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Mede performance de carregamento da página.")
parser.add_argument("--port",   type=int, default=8732)
parser.add_argument("--no-cdn", action="store_true", help="Pula fetch de CDN externos")
args = parser.parse_args()

PORT  = args.port
BASE  = f"http://localhost:{PORT}"

# ── Cores terminal ────────────────────────────────────────────────────────────
R = "\033[0m"; BOLD = "\033[1m"; DIM = "\033[2m"
GREEN = "\033[92m"; YELLOW = "\033[93m"; RED = "\033[91m"; CYAN = "\033[96m"; BLUE = "\033[94m"

def col(text, c): return f"{c}{text}{R}"
def bold(t): return col(t, BOLD)
def dim(t):  return col(t, DIM)

def bar(ratio, width=20):
    filled = round(ratio * width)
    return col("█" * filled, CYAN) + col("░" * (width - filled), DIM)

# ── Helpers ───────────────────────────────────────────────────────────────────
def fmt_size(b):
    if b >= 1_048_576: return f"{b/1_048_576:.1f} MB"
    if b >= 1_024:     return f"{b/1_024:.1f} KB"
    return f"{b} B"

def fmt_ms(s): return f"{s*1000:.0f} ms"

def size_color(b):
    if b > 500_000: return RED
    if b > 100_000: return YELLOW
    return GREEN

def ttfb_color(ms):
    if ms > 200: return RED
    if ms > 50:  return YELLOW
    return GREEN

def delta_str(old, new, unit="ms", invert=False):
    if old is None: return ""
    diff = new - old
    if abs(diff) < 0.5: return dim("  (sem mudança)")
    sign  = "+" if diff > 0 else "−"
    val   = abs(diff)
    worse = diff > 0 if not invert else diff < 0
    c     = RED if worse else GREEN
    return col(f"  {sign}{val:.0f}{unit}", c)

# ── Porta livre? ──────────────────────────────────────────────────────────────
def port_free(p):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", p)) != 0

# ── Servidor HTTP local ───────────────────────────────────────────────────────
def start_server():
    if not port_free(PORT):
        print(f"{YELLOW}Porta {PORT} já ocupada — assumindo servidor rodando.{R}")
        return None
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    time.sleep(0.8)
    print(f"{GREEN}✓{R} Servidor iniciado em {CYAN}{BASE}{R}  (PID {proc.pid})")
    return proc

def stop_server(proc):
    if proc:
        proc.terminate()
        proc.wait()
        print(f"\n{DIM}Servidor encerrado.{R}")

# ── Curl timing via --write-out ───────────────────────────────────────────────
CURL_FMT = (
    '{"ttfb":%{time_starttransfer},'
    '"total":%{time_total},'
    '"size":%{size_download},'
    '"http":%{response_code}}'
)

def fetch(url, label=None, timeout=30):
    label = label or url
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", str(timeout),
             "-A", "perf-check/1.0",
             "-H", "Accept-Encoding: gzip, br",
             "-w", CURL_FMT, "-o", "/dev/null", url],
            capture_output=True, text=True, timeout=timeout + 2,
        )
        data = json.loads(result.stdout)
        return {
            "url":   url,
            "label": label,
            "ttfb":  data["ttfb"],
            "total": data["total"],
            "size":  int(data["size"]),
            "http":  int(data["http"]),
            "ok":    int(data["http"]) in (200, 304),
        }
    except Exception as e:
        return {"url": url, "label": label, "ttfb": 0, "total": 0, "size": 0, "http": 0, "ok": False, "error": str(e)}

# ── Parse index.html para extrair recursos ────────────────────────────────────
def parse_resources():
    html = (ROOT / "index.html").read_text()
    resources = []

    # CSS links
    for m in re.finditer(r'<link[^>]+href=["\']([^"\']+\.css)["\']', html):
        href = m.group(1)
        if href.startswith("http"):
            resources.append(("cdn-css", href, href.split("/")[-1][:40]))
        else:
            resources.append(("css", f"{BASE}/{href}", href))

    # CDN scripts (src=http...)
    for m in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\']', html):
        src = m.group(1)
        if src.startswith("http"):
            name = src.split("/")[-1][:50]
            resources.append(("cdn-js", src, name))

    # Local JSX / JS
    for m in re.finditer(r'<script[^>]+src=["\']([^"\']+\.jsx?)["\']', html):
        src = m.group(1)
        if not src.startswith("http"):
            resources.append(("jsx", f"{BASE}/{src}", src))

    # Assets referenciados nos JSX locais
    for jsx in ROOT.glob("*.jsx"):
        for m in re.finditer(r'src=["\']([^"\']+)["\']', jsx.read_text()):
            asset = m.group(1)
            if not asset.startswith("http") and not asset.startswith("{"):
                resources.append(("asset", f"{BASE}/{asset}", asset.split("/")[-1][:40]))

    # dedupe mantendo ordem
    seen = set()
    out  = []
    for item in resources:
        if item[1] not in seen:
            seen.add(item[1])
            out.append(item)
    return out

# ── Exibe tabela de resultados ────────────────────────────────────────────────
TYPE_ICON = {
    "css":     "🎨", "cdn-css": "🎨", "cdn-js": "📦",
    "jsx":     "⚛️ ", "asset":   "🖼️ ",
}

def print_table(rows, prev):
    col_w = max(len(r["label"]) for r in rows) + 2
    header = f"  {'Recurso':<{col_w}}  {'Tamanho':>9}   {'TTFB':>7}   {'Total':>7}  Barra"
    print(f"\n{bold(header)}")
    print(dim("  " + "─" * (col_w + 50)))

    groups = {}
    for r in rows:
        groups.setdefault(r["type"], []).append(r)

    totals = {"size": 0, "ttfb_sum": 0, "n": 0, "blocked": 0}

    for gtype in ["cdn-js", "cdn-css", "css", "jsx", "asset"]:
        if gtype not in groups: continue
        label_map = {"cdn-js": "CDN JavaScript", "cdn-css": "CDN CSS", "css": "CSS local",
                     "jsx": "JSX / Scripts", "asset": "Imagens"}
        print(f"\n  {DIM}{label_map[gtype]}{R}")

        for r in groups[gtype]:
            icon = TYPE_ICON.get(gtype, "  ")
            name = r["label"][:col_w]
            sz   = r["size"]
            ttfb = r["ttfb"] * 1000
            tot  = r["total"] * 1000

            if not r["ok"]:
                print(f"  {icon} {RED}{name:<{col_w}}{R}  {'N/A':>9}  {'ERRO':>7}")
                continue

            sz_str   = col(f"{fmt_size(sz):>9}", size_color(sz))
            ttfb_str = col(f"{ttfb:>6.0f}ms", ttfb_color(ttfb))
            tot_str  = f"{tot:>6.0f}ms"

            prev_key = r["url"]
            p = prev.get(prev_key) if prev else None
            d_size = delta_str(p["size"] if p else None, sz, "B", invert=True)
            d_ttfb = delta_str(p["ttfb_ms"] if p else None, ttfb)

            max_sz = 2_000_000
            b = bar(min(sz / max_sz, 1.0), 16)
            print(f"  {icon} {name:<{col_w}}  {sz_str}  {ttfb_str}  {tot_str}  {b}{d_size}")

            totals["size"]     += sz
            totals["ttfb_sum"] += ttfb
            totals["n"]        += 1
            if gtype in ("cdn-js", "cdn-css", "css"):
                totals["blocked"] += sz

    print(dim("  " + "─" * (col_w + 50)))
    p_tot = prev.get("__total__") if prev else None
    d_tot = delta_str(p_tot["size"] if p_tot else None, totals["size"], "B", invert=True)
    print(f"\n  {bold('Total transferido:')}  {col(fmt_size(totals['size']), size_color(totals['size']))}{d_tot}")
    print(f"  {bold('Render-blocking:')}    {col(fmt_size(totals['blocked']), size_color(totals['blocked']))}  {DIM}(CSS + CDN JS antes do body){R}")
    avg_ttfb = totals["ttfb_sum"] / totals["n"] if totals["n"] else 0
    print(f"  {bold('TTFB médio local:')}   {col(fmt_ms(avg_ttfb/1000), ttfb_color(avg_ttfb))}")
    return totals

# ── Sugestões de otimização ───────────────────────────────────────────────────
def print_suggestions(rows):
    suggestions = []

    for r in rows:
        if not r["ok"]: continue
        name = r["label"].lower()

        if "babel" in name and r["size"] > 400_000:
            suggestions.append((RED, "🐢 Babel Standalone",
                "É o maior recurso da página (~900 KB). Pré-compilar os JSX elimina esta dependência completamente."))
        if "react.development" in name:
            suggestions.append((YELLOW, "⚛️  React (development build)",
                "Trocar para react.production.min.js reduz ~70 KB e remove warnings de runtime."))
        if "react-dom.development" in name:
            suggestions.append((YELLOW, "⚛️  ReactDOM (development build)",
                "Trocar para react-dom.production.min.js reduz ~200 KB."))
        if r["type"] in ("cdn-js", "cdn-css") and r["ttfb"] > 0.3:
            suggestions.append((YELLOW, f"🌐 CDN lento ({r['label'][:40]})",
                f"TTFB de {r['ttfb']*1000:.0f}ms. Considere self-hosting ou usar jsDelivr."))
        if r["type"] == "asset" and r["size"] > 300_000:
            suggestions.append((YELLOW, f"🖼️  Imagem pesada ({r['label'][:40]})",
                f"{fmt_size(r['size'])}. Comprimir para WebP pode reduzir 60-80%."))

    # Google Fonts via CSS import
    html = (ROOT / "index.html").read_text()
    css_content = "".join((ROOT / f).read_text() for f in ["styles.css", "ui.css"] if (ROOT / f).exists())
    if "@import url(" in css_content and "fonts.googleapis" in css_content:
        suggestions.append((YELLOW, "🔤 Google Fonts via @import",
            "@import é render-blocking. Mover para <link rel=preconnect> + <link rel=stylesheet> no <head> é mais rápido."))

    if not suggestions:
        print(f"\n  {GREEN}✓ Nenhuma sugestão óbvia — está bem otimizado para um site estático com CDN.{R}")
        return

    print(f"\n{bold('  Sugestões de otimização:')}\n")
    for i, (c, title, desc) in enumerate(suggestions, 1):
        print(f"  {col(str(i) + '.', c)} {bold(title)}")
        print(f"     {dim(desc)}\n")

# ── Persistência de histórico ─────────────────────────────────────────────────
def load_history():
    if HISTORY.exists():
        try: return json.loads(HISTORY.read_text())
        except: pass
    return {}

def save_history(rows, totals):
    data = {}
    for r in rows:
        if r["ok"]:
            data[r["url"]] = {"size": r["size"], "ttfb_ms": r["ttfb"] * 1000, "total_ms": r["total"] * 1000}
    data["__total__"] = {"size": totals["size"]}
    data["__ts__"]    = time.strftime("%Y-%m-%d %H:%M:%S")
    HISTORY.write_text(json.dumps(data, indent=2))

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print(f"\n{bold('━━━ Velhos Sabores · Análise de Performance ━━━')}")
    print(f"{DIM}Servidor: {BASE}  |  Histórico: {HISTORY.name}{R}\n")

    prev    = load_history()
    if prev:
        ts = prev.get("__ts__", "?")
        print(f"{DIM}Comparando com medição anterior: {ts}{R}\n")

    server = start_server()
    resources = parse_resources()

    print(f"\n{CYAN}Buscando {len(resources)} recursos...{R}")

    rows = []
    for rtype, url, label in resources:
        if args.no_cdn and rtype in ("cdn-js", "cdn-css"):
            continue
        sys.stdout.write(f"  ⬇  {label[:55]:<55}\r")
        sys.stdout.flush()
        r = fetch(url)
        r["type"]  = rtype
        r["label"] = label
        rows.append(r)

    sys.stdout.write(" " * 70 + "\r")  # limpa linha

    totals = print_table(rows, prev)
    print_suggestions(rows)
    save_history(rows, totals)

    print(f"\n{DIM}Resultados salvos em {HISTORY}  —  execute novamente para comparar.{R}\n")
    stop_server(server)

if __name__ == "__main__":
    main()
