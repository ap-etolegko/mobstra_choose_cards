#!/usr/bin/env bash
# Convert source PNGs to the WebP files used in public/.
# Requires cwebp (brew install webp).
#
# Usage: scripts/optimize-images.sh <src-dir>
#   <src-dir> must contain phone-sky.png, phone-brain.png, logo.png
#
# Phones: keep original size (466px = 2x of the widest rendered card), lossy q85, lossless alpha.
# Logo:   rendered at 200px wide -> 600px (3x) lossless.
set -euo pipefail

SRC="${1:?usage: $0 <src-dir>}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public"

cwebp -quiet -q 85 -m 6 -sharp_yuv -alpha_q 100 -metadata none "$SRC/phone-sky.png" -o "$OUT/phone-sky.webp"
cwebp -quiet -q 85 -m 6 -sharp_yuv -alpha_q 100 -metadata none "$SRC/phone-brain.png" -o "$OUT/phone-brain.webp"
cwebp -quiet -lossless -z 9 -resize 600 0 -metadata none "$SRC/logo.png" -o "$OUT/logo.webp"

ls -la "$OUT"/*.webp
