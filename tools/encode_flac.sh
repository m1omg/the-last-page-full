#!/usr/bin/env bash
# Re-encode every BGM/SFX WAV as FLAC (bit-exact, ~4x smaller — the browser
# loads the FLAC and falls back to the WAV, see src/audio.js). Run this after
# tools/make_audio.py whenever audio is re-synthesized; validate.mjs fails if
# a WAV is newer than its FLAC twin.
set -euo pipefail
cd "$(dirname "$0")/../assets/audio"
for f in *.wav; do
  flac --best --silent -f -o "${f%.wav}.flac" "$f"
done
echo "encoded $(ls *.flac | wc -l) FLACs"
