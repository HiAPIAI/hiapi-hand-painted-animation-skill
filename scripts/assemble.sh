#!/usr/bin/env bash
# assemble.sh: render every frame → MP4 (with the song, if the project has one) → burn subtitles (if given).
#   scripts/assemble.sh <project dir> <out.mp4> [lines.tsv] [workers=4]
# Resumable: frames already in mv/out/frames are skipped (delete them after changing a scene).
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$(cd "${1:?project dir}" && pwd)"; OUT="${2:?out.mp4}"; TSV="${3:-}"; WORKERS="${4:-4}"
mkdir -p "$(dirname "$OUT")"; OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
[ -n "$TSV" ] && TSV="$(cd "$(dirname "$TSV")" && pwd)/$(basename "$TSV")"
AUDIO=""; [ -f "$DIR/mv/assets/song.mp3" ] && AUDIO="--audio=assets/song.mp3"
(cd "$DIR/mv" && node render.mjs --frames --workers="$WORKERS" && node render.mjs --encode $AUDIO --out=out/video.mp4)
if [ -n "$TSV" ]; then uv run --with pillow python "$SKILL/scripts/make_subs.py" "$DIR/mv/out/video.mp4" "$OUT" "$TSV"
else cp "$DIR/mv/out/video.mp4" "$OUT"; fi
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of compact "$OUT"
