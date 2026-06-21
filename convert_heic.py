#!/usr/bin/env python3
"""Convert all .heic files in assets/products/ to .jpg using sips (macOS) or ffmpeg."""

import subprocess
import sys
from pathlib import Path
from shutil import which

ASSETS_DIR = Path(__file__).parent / "assets" / "products"
QUALITY = 90  # 0-100; used only by ffmpeg (sips uses its own default ~85)


def detect_backend():
    if which("sips"):
        return "sips"
    if which("ffmpeg"):
        return "ffmpeg"
    return None


def convert_sips(heic_path, jpeg_path):
    subprocess.run(
        ["sips", "-s", "format", "jpeg", str(heic_path), "--out", str(jpeg_path)],
        check=True, capture_output=True,
    )


def convert_ffmpeg(heic_path, jpeg_path):
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(heic_path), "-q:v", str(int((100 - QUALITY) / 100 * 31 + 1)), str(jpeg_path)],
        check=True, capture_output=True,
    )


def main():
    backend = detect_backend()
    if backend is None:
        print("sips (macOS) e ffmpeg não encontrados. Instale ffmpeg: brew install ffmpeg")
        sys.exit(1)

    print(f"Backend: {backend}")

    heic_files = sorted(ASSETS_DIR.glob("*.heic")) + sorted(ASSETS_DIR.glob("*.HEIC"))
    if not heic_files:
        print("Nenhum arquivo .heic encontrado em", ASSETS_DIR)
        sys.exit(0)

    print(f"Convertendo {len(heic_files)} arquivos...\n")

    ok, skipped, failed = 0, 0, 0
    for heic_path in heic_files:
        jpeg_path = heic_path.with_suffix(".jpg")
        if jpeg_path.exists():
            skipped += 1
            continue
        try:
            if backend == "sips":
                convert_sips(heic_path, jpeg_path)
            else:
                convert_ffmpeg(heic_path, jpeg_path)
            print(f"  OK  {heic_path.name}")
            ok += 1
        except subprocess.CalledProcessError as e:
            print(f"  ERR {heic_path.name}: {e.stderr.decode().strip()[:120]}")
            failed += 1

    print(f"\nPronto: {ok} convertidos, {skipped} já existiam, {failed} erros.")


if __name__ == "__main__":
    main()
