#!/usr/bin/env python3
"""
network-report.py — Relatório de tamanho e simulação de rede para Velhos Sabores

Uso:
    python3 network-report.py           # inicia servidor automaticamente
    python3 network-report.py --port N  # porta customizada (padrão: 8732)
    python3 network-report.py --offline # só analisa arquivos locais (sem CDN)
"""

import subprocess, sys, json, gzip, re, argparse, socket, time, math
from pathlib import Path

ROOT = Path(__file__).parent
parser = argparse.ArgumentParser()
parser.add_argument("--port",    type=int, default=8732)
parser.add_argument("--offline", action="store_true")
args = parser.parse_args()

PORT = args.port
BASE = f"http://localhost:{PORT}"

# ── Cores ─────────────────────────────────────────────────────────────────────
R = "\033[0m"; BOLD = "\033[1m"; DIM = "\033[2m"
GREEN = "\033[92m"; YELLOW = "\033[93m"; RED = "\033[91m"
CYAN = "\033[96m"; BLUE = "\033[94m"; MAGENTA = "\033[95m"

def c(text, color): return f"{color}{text}{R}"
def bold(t):  return c(t, BOLD)
def dim(t):   return c(t, DIM)
def green(t): return c(t, GREEN)
def yellow(t):return c(t, YELLOW)
def red(t):   return c(t, RED)
def cyan(t):  return c(t, CYAN)

# ── Perfis de rede ─────────────────────────────────────────────────────────────
# bandwidth_kbps = velocidade de download em Kbps
# rtt_ms = round-trip time (latência) em ms
# parallel = conexões paralelas por domínio
NETWORKS = [
    {"name": "3G Lento",   "emoji": "🐢", "bw_kbps":    700, "rtt_ms": 400, "parallel": 3,  "color": RED},
    {"name": "3G Rápido",  "emoji": "📶", "bw_kbps":   5000, "rtt_ms": 150, "parallel": 4,  "color": YELLOW},
    {"name": "4G LTE",     "emoji": "📡", "bw_kbps":  20000, "rtt_ms":  50, "parallel": 6,  "color": CYAN},
    {"name": "5G",         "emoji": "🚀", "bw_kbps": 150000, "rtt_ms":  10, "parallel": 10, "color": GREEN},
    {"name": "Wi-Fi",      "emoji": "📶", "bw_kbps": 100000, "rtt_ms":   5, "parallel": 6,  "color": GREEN},
]

# ── Helpers de formatação ──────────────────────────────────────────────────────
def fmt_size(b):
    if b >= 1_048_576: return f"{b/1_048_576:.2f} MB"
    if b >= 1_024:     return f"{b/1_024:.1f} KB"
    return f"{b} B"

def fmt_ms(ms):
    if ms >= 1000: return f"{ms/1000:.1f}s"
    return f"{ms:.0f}ms"

def size_color(b):
    if b > 500_000: return RED
    if b > 100_000: return YELLOW
    return GREEN

def time_color(ms):
    if ms > 5000:  return RED
    if ms > 2000:  return YELLOW
    if ms > 800:   return CYAN
    return GREEN

def bar(ratio, width=22, color=CYAN):
    filled = round(min(ratio, 1.0) * width)
    return c("█" * filled, color) + c("░" * (width - filled), DIM)

def hbar(label, value, max_value, width=30, color=CYAN):
    ratio = value / max_value if max_value > 0 else 0
    filled = round(min(ratio, 1.0) * width)
    b = c("█" * filled, color) + c("░" * (width - filled), DIM)
    return f"  {label:<14} {b}  {fmt_ms(value)}"

# ── Servidor HTTP ──────────────────────────────────────────────────────────────
def port_free(p):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", p)) != 0

def start_server():
    if not port_free(PORT):
        return None
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    time.sleep(0.7)
    return proc

def stop_server(proc):
    if proc: proc.terminate(); proc.wait()

# ── Fetch de recurso com curl ──────────────────────────────────────────────────
CURL_FMT = '{"ttfb":%{time_starttransfer},"total":%{time_total},"size":%{size_download},"http":%{response_code}}'

def fetch(url, timeout=30):
    try:
        r = subprocess.run(
            ["curl", "-s", "-L", "--max-time", str(timeout),
             "-H", "Accept-Encoding: gzip, br",
             "-w", CURL_FMT, "-o", "/dev/null", url],
            capture_output=True, text=True, timeout=timeout + 2,
        )
        d = json.loads(r.stdout)
        return {"ok": int(d["http"]) == 200, "size": int(d["size"]),
                "ttfb_ms": d["ttfb"] * 1000, "total_ms": d["total"] * 1000}
    except:
        return {"ok": False, "size": 0, "ttfb_ms": 0, "total_ms": 0}

# ── Tamanho gzip local (estimativa comprimida) ─────────────────────────────────
def gzip_size(path):
    try:
        data = Path(path).read_bytes()
        return len(gzip.compress(data, compresslevel=9))
    except:
        return 0

# ── Parse do index.html ────────────────────────────────────────────────────────
def parse_resources():
    html_path = ROOT / "index.html"
    html = html_path.read_text()

    resources = []

    # CSS links no <head>
    for m in re.finditer(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']|<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', html):
        href = m.group(1) or m.group(2)
        if "fonts.googleapis" in href:
            resources.append({"label": "Google Fonts CSS", "url": href,       "type": "cdn-css",  "critical": True,  "local": False})
        elif href.startswith("http"):
            resources.append({"label": href.split("/")[-1][:40], "url": href, "type": "cdn-css",  "critical": True,  "local": False})
        else:
            resources.append({"label": href,  "url": f"{BASE}/{href}",        "type": "css",      "critical": True,  "local": True,  "path": ROOT / href})

    # Scripts CDN
    for m in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\']', html):
        src = m.group(1)
        if src.startswith("http"):
            name = src.split("/")[-1][:50]
            resources.append({"label": name, "url": src, "type": "cdn-js", "critical": True, "local": False})

    # Scripts JSX locais
    for m in re.finditer(r'<script[^>]+src=["\']([^"\']+\.jsx?)["\']', html):
        src = m.group(1)
        if not src.startswith("http"):
            resources.append({"label": src, "url": f"{BASE}/{src}", "type": "jsx", "critical": False, "local": True, "path": ROOT / src})

    # Imagens referenciadas nos JSX
    seen_assets = set()
    for jsx in ROOT.glob("*.jsx"):
        for m in re.finditer(r'''(?:src|href)=["']([^"'{}]+)["']''', jsx.read_text()):
            asset = m.group(1)
            if asset in seen_assets or asset.startswith("http") or not any(asset.endswith(e) for e in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]):
                continue
            seen_assets.add(asset)
            path = ROOT / asset
            if path.exists():
                resources.append({"label": asset.split("/")[-1][:40], "url": f"{BASE}/{asset}", "type": "asset", "critical": False, "local": True, "path": path})

    # dedupe por url
    seen, out = set(), []
    for r in resources:
        if r["url"] not in seen:
            seen.add(r["url"])
            out.append(r)
    return out

# ── Simulação de carregamento ──────────────────────────────────────────────────
def simulate(resources, net):
    """
    Modelo simplificado de waterfall HTTP/1.1:

    1. DNS + TCP para cada domínio único → rtt_ms por domínio
    2. HTML transfer (já temos o tamanho)
    3. CSS (crítico) em paralelo → maior CSS / bw
    4. Fontes descobertas via CSS → +1 RTT + transfer
    5. JS bloqueante (CDN) → serial, cada um = RTT + transfer
    6. JSX locais → paralelo em lotes de `parallel` conexões
    7. Imagens → não bloqueiam renderização
    """
    bw_bps    = net["bw_kbps"] * 1000 / 8   # bytes/s
    rtt       = net["rtt_ms"]                 # ms
    par       = net["parallel"]

    def transfer(b): return (b / bw_bps) * 1000  # ms

    # Domínios únicos
    domains = set()
    for r in resources:
        host = r["url"].split("/")[2] if "://" in r["url"] else "localhost"
        domains.add(host)
    dns_tcp_ms = len(domains) * rtt

    # HTML (index.html)
    html_size = (ROOT / "index.html").stat().st_size
    html_gz   = gzip_size(ROOT / "index.html")
    t = dns_tcp_ms + transfer(html_gz or html_size)

    # CSS crítico (paralelo)
    css_res = [r for r in resources if r["type"] in ("css", "cdn-css") and r["critical"]]
    if css_res:
        biggest_css = max(r.get("size_gz", r.get("size_raw", 0)) for r in css_res)
        t += rtt + transfer(biggest_css)

    # Fontes: descobertas depois do CSS → +1 RTT + transferência pequena (~10KB)
    has_fonts = any("font" in r["label"].lower() or "googleapis" in r["url"] for r in resources)
    if has_fonts:
        t += rtt + transfer(12_000)  # CSS de fontes ~12KB

    # JS bloqueante (CDN) — serial (cada script bloqueia o próximo)
    cdn_js = [r for r in resources if r["type"] == "cdn-js"]
    for r in cdn_js:
        t += rtt + transfer(r.get("size_gz", r.get("size_raw", 0)))

    fcp_ms = t  # First Contentful Paint estimado

    # JSX locais — carregados em paralelo depois do Babel
    jsx_res = [r for r in resources if r["type"] == "jsx"]
    if jsx_res:
        batches  = math.ceil(len(jsx_res) / par)
        jsx_total = sum(r.get("size_gz", r.get("size_raw", 0)) for r in jsx_res)
        t += rtt + transfer(jsx_total / par) * batches

    tti_ms = t  # Time to Interactive

    # Imagens (não bloqueiam, mas afetam LCP)
    assets = [r for r in resources if r["type"] == "asset"]
    if assets:
        img_total = sum(r.get("size_raw", 0) for r in assets)
        img_time  = rtt + transfer(img_total / min(par, 4))
    else:
        img_time = 0

    lcp_ms = tti_ms + img_time * 0.4  # LCP costuma ser a maior imagem acima do fold

    return {"fcp": fcp_ms, "tti": tti_ms, "lcp": lcp_ms}

# ── Relatório principal ────────────────────────────────────────────────────────
def main():
    W = 72
    print()
    print(bold("━" * W))
    print(bold(f"  📊  Velhos Sabores · Relatório de Tamanho e Rede"))
    print(bold("━" * W))
    print()

    server  = start_server()
    if server:
        print(f"  {green('✓')} Servidor local em {cyan(BASE)}\n")

    resources = parse_resources()

    # ── Fetch de tamanhos ──────────────────────────────────────────────────────
    print(f"  Medindo {len(resources)} recursos...\n")
    for r in resources:
        skip = args.offline and not r["local"]
        if skip:
            r["size_raw"] = 0
            r["size_gz"]  = 0
            r["ok"]       = False
            continue

        sys.stdout.write(f"  ⬇  {r['label'][:60]:<60}\r")
        sys.stdout.flush()

        if r["local"] and r.get("path"):
            r["size_raw"] = r["path"].stat().st_size if r["path"].exists() else 0
            r["size_gz"]  = gzip_size(r["path"])
            r["ok"]       = r["path"].exists()
        else:
            d = fetch(r["url"])
            r["size_raw"] = d["size"]
            r["size_gz"]  = round(d["size"] * 0.28) if r["type"] in ("cdn-js",) else round(d["size"] * 0.25)
            r["ok"]       = d["ok"]
            r["ttfb_ms"]  = d["ttfb_ms"]

    sys.stdout.write(" " * 70 + "\r")

    # ── Tabela de recursos ─────────────────────────────────────────────────────
    total_raw = sum(r["size_raw"] for r in resources if r["ok"])
    total_gz  = sum(r.get("size_gz", r["size_raw"]) for r in resources if r["ok"])

    TYPE_LABEL = {
        "cdn-js":  ("CDN JavaScript (bloqueante)", "📦"),
        "cdn-css": ("CDN CSS / Fontes",            "🎨"),
        "css":     ("CSS local",                   "🎨"),
        "jsx":     ("JSX / Scripts",               "⚛️ "),
        "asset":   ("Imagens",                     "🖼️ "),
    }
    ORDER = ["cdn-js", "cdn-css", "css", "jsx", "asset"]

    print(bold(f"  {'Recurso':<42} {'Bruto':>9}  {'Gzip':>9}  {'Razão':>6}"))
    print(dim("  " + "─" * 70))

    for gtype in ORDER:
        group = [r for r in resources if r["type"] == gtype]
        if not group: continue
        label, icon = TYPE_LABEL[gtype]
        print(f"\n  {dim(label)}")

        for r in group:
            if not r["ok"]:
                print(f"  {icon} {r['label']:<42} {dim('N/A'):>9}")
                continue
            raw   = r["size_raw"]
            gz    = r.get("size_gz", raw)
            ratio = (1 - gz / raw) * 100 if raw > 0 else 0
            raw_s = c(f"{fmt_size(raw):>9}", size_color(raw))
            gz_s  = c(f"{fmt_size(gz):>9}", size_color(gz))
            crit  = c(" ⚠ crítico", RED) if r["critical"] and gtype == "cdn-js" else ""
            print(f"  {icon} {r['label']:<42} {raw_s}  {gz_s}  {dim(f'{ratio:>5.0f}%')}{crit}")

    print(dim("\n  " + "─" * 70))

    html_raw = (ROOT / "index.html").stat().st_size
    html_gz  = gzip_size(ROOT / "index.html")
    all_raw  = total_raw + html_raw
    all_gz   = total_gz  + html_gz

    html_raw_s = c(f"{fmt_size(html_raw):>9}", GREEN)
    html_gz_s  = c(f"{fmt_size(html_gz):>9}", GREEN)
    print(f"  {'HTML (index.html)':<42} {html_raw_s}  {html_gz_s}")
    print()
    print(f"  {bold('Total sem compressão:')}  {c(fmt_size(all_raw), size_color(all_raw))}")
    print(f"  {bold('Total com gzip:      ')}  {c(fmt_size(all_gz),  size_color(all_gz))}  {dim('← o que o browser baixa de fato')}")

    critical_gz = sum(r.get("size_gz", r["size_raw"]) for r in resources if r.get("critical") and r["ok"])
    print(f"  {bold('Caminho crítico:     ')}  {c(fmt_size(critical_gz), size_color(critical_gz))}  {dim('← bloqueia a primeira renderização')}")

    # ── Simulação de rede ──────────────────────────────────────────────────────
    print()
    print(bold("━" * W))
    print(bold("  🌐  Simulação de Tempo de Carregamento por Rede"))
    print(dim("  FCP = First Contentful Paint  ·  TTI = Time to Interactive  ·  LCP = Largest Contentful Paint"))
    print(bold("━" * W))
    print()

    results = []
    for net in NETWORKS:
        r = simulate(resources, net)
        results.append((net, r))

    # Encontra o máximo para escalar as barras
    max_tti = max(r["tti"] for _, r in results)

    header = f"  {'Rede':<14} {'FCP':>8}  {'TTI':>8}  {'LCP':>8}  {'Barra (TTI)':}"
    print(bold(header))
    print(dim("  " + "─" * 70))

    for net, r in results:
        nc     = net["color"]
        fcp_s  = c(fmt_ms(r["fcp"]), time_color(r["fcp"]))
        tti_s  = c(fmt_ms(r["tti"]), time_color(r["tti"]))
        lcp_s  = c(fmt_ms(r["lcp"]), time_color(r["lcp"]))
        b      = bar(r["tti"] / max_tti, 28, nc)
        name   = c(f"{net['emoji']} {net['name']}", nc)
        print(f"  {name:<24} {fcp_s:>14}  {tti_s:>14}  {lcp_s:>14}  {b}")

    print()
    print(dim("  Modelo: HTTP/1.1, sem cache, compressão gzip ativada no servidor."))
    print(dim("  RTT e largura de banda baseados em médias reais ITU/Google PageSpeed."))

    # ── Maiores gargalos ───────────────────────────────────────────────────────
    print()
    print(bold("━" * W))
    print(bold("  🔎  Maiores Contribuidores de Peso"))
    print(bold("━" * W))
    print()

    sorted_res = sorted(
        [r for r in resources if r["ok"]],
        key=lambda r: r.get("size_gz", r["size_raw"]), reverse=True
    )[:7]

    max_sz = sorted_res[0].get("size_gz", sorted_res[0]["size_raw"]) if sorted_res else 1

    for r in sorted_res:
        sz    = r.get("size_gz", r["size_raw"])
        ratio = sz / max_sz
        col   = size_color(sz)
        b     = bar(ratio, 24, col)
        sz_s = c(f"{fmt_size(sz):>9}", col)
        print(f"  {r['label']:<40}  {sz_s}  {b}")

    # ── Recomendações ──────────────────────────────────────────────────────────
    print()
    print(bold("━" * W))
    print(bold("  💡  Recomendações"))
    print(bold("━" * W))
    print()

    recs = []

    babel = next((r for r in resources if "babel" in r["label"].lower()), None)
    if babel and babel.get("size_raw", 0) > 400_000:
        saving = babel.get("size_gz", babel["size_raw"])
        recs.append((RED, "Eliminar Babel Standalone",
            f"O maior recurso único (~{fmt_size(babel['size_raw'])} bruto). Pré-compilar os JSX com Vite/esbuild",
            f"remove esta dependência completamente → economia de ~{fmt_size(saving)} gzip no carregamento."))

    dev_builds = any("development" in r["url"] for r in resources)
    if dev_builds:
        recs.append((YELLOW, "Usar builds de produção do React",
            "react.development.js e react-dom.development.js são ~3× maiores que as builds",
            "minificadas. Trocar para react.production.min.js economiza ~270 KB."))

    fonts = any("font" in r["label"].lower() or "googleapis" in r["url"] for r in resources)
    import_in_css = any(
        "@import" in Path(f).read_text()
        for f in [ROOT/"styles.css", ROOT/"ui.css"] if Path(f).exists()
    )
    if fonts and import_in_css:
        recs.append((YELLOW, "Google Fonts via @import (render-blocking)",
            "@import dentro de CSS bloqueia a renderização até a fonte ser baixada.",
            "Mover para <link rel=preconnect> + <link rel=stylesheet> no <head> é mais rápido."))

    large_imgs = [r for r in resources if r["type"] == "asset" and r.get("size_raw", 0) > 200_000]
    if large_imgs:
        total_img = sum(r["size_raw"] for r in large_imgs)
        recs.append((YELLOW, f"{len(large_imgs)} imagem(s) pesada(s) ({fmt_size(total_img)} total)",
            "Converter para WebP com qualidade 80 pode reduzir 50–70% do tamanho.",
            "Use: `cwebp -q 80 entrada.jpg -o saida.webp` ou ImageOptim."))

    img_no_lazy = len([r for r in resources if r["type"] == "asset"])
    if img_no_lazy > 2:
        recs.append((CYAN, "Adicionar loading='lazy' nas imagens abaixo do fold",
            "Imagens fora da viewport inicial só serão baixadas quando o usuário rolar.",
            "Adicionar loading='lazy' nas tags <img> reduz o peso inicial da página."))

    if not recs:
        print(f"  {green('✓')} Parabéns — a página está bem otimizada para um site estático.\n")
    else:
        for i, (col, title, line1, line2) in enumerate(recs, 1):
            print(f"  {c(str(i)+'.', col)} {bold(title)}")
            print(f"     {dim(line1)}")
            print(f"     {dim(line2)}\n")

    # ── Resumo ─────────────────────────────────────────────────────────────────
    print(bold("━" * W))
    print(bold("  📋  Resumo"))
    print(bold("━" * W))
    print()

    g3_slow = next(r for net, r in results if net["name"] == "3G Lento")
    g4      = next(r for net, r in results if net["name"] == "4G LTE")
    g5      = next(r for net, r in results if net["name"] == "5G")

    print(f"  Tamanho total (gzip):    {bold(c(fmt_size(all_gz), size_color(all_gz)))}")
    print(f"  Recursos carregados:     {bold(str(len([r for r in resources if r['ok']]) + 1))}  (incluindo HTML)")
    print(f"  Caminho crítico (gzip):  {bold(c(fmt_size(critical_gz), size_color(critical_gz)))}")
    print()
    print(f"  Tempo até interativo estimado:")
    print(f"    3G Lento  →  {c(fmt_ms(g3_slow['tti']), time_color(g3_slow['tti']))}")
    print(f"    4G LTE    →  {c(fmt_ms(g4['tti']),      time_color(g4['tti']))}")
    print(f"    5G        →  {c(fmt_ms(g5['tti']),      time_color(g5['tti']))}")
    print()

    stop_server(server)
    if server:
        print(dim("  Servidor encerrado.\n"))

if __name__ == "__main__":
    main()
