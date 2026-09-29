#!/usr/bin/env bash
# setup-animation.sh: a ready-to-animate ClaudeAnimationBase project.
#   scripts/setup-animation.sh <project dir> [--song=song.mp3] [--align=song.mp3.align.json] [--logo=logo.png] [--seconds=90] [--bpm=100]
# Clones JohnHeibel/ClaudeAnimationBase (MIT) into <project>/mv, installs it, applies patch-base.mjs, copies the
# reference kit (templates/lib.js, made.js), writes src/config.js (from the song alignment when there is a song,
# otherwise --seconds / --bpm), copies the song, embeds the logo, and writes studio.html + studio_a…e.html.
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${1:?project dir}"; shift
SONG=""; ALIGN=""; LOGO=""; SECONDS_=90; BPM=100
for a in "$@"; do case "$a" in
  --song=*) SONG="${a#*=}";; --align=*) ALIGN="${a#*=}";; --logo=*) LOGO="${a#*=}";;
  --seconds=*) SECONDS_="${a#*=}";; --bpm=*) BPM="${a#*=}";; *) echo "unknown flag $a"; exit 1;; esac; done
[ -n "$SONG" ] && [ -z "$ALIGN" ] && ALIGN="$SONG.align.json"
MV="$DIR/mv"
command -v node >/dev/null || { echo "node 18+ is required"; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg is required"; exit 1; }
[ -f "$MV/render.mjs" ] || git clone --depth 1 https://github.com/JohnHeibel/ClaudeAnimationBase "$MV"
(cd "$MV" && npm install --no-audit --no-fund >/dev/null)
node "$SKILL/scripts/patch-base.mjs" "$MV"
cp "$SKILL/templates/lib.js" "$SKILL/templates/made.js" "$MV/src/"
mkdir -p "$MV/assets" "$MV/src/scenes" "$DIR/post"
if [ -n "$SONG" ]; then
  ffmpeg -v error -y -i "$SONG" -codec:a libmp3lame -q:a 2 "$MV/assets/song.mp3"
  [ -f "$ALIGN" ] || { echo "no alignment at $ALIGN: run scripts/align.py on the song first"; exit 1; }
  node -e '
    const a = require(process.argv[1]);
    const s = `// config.js: project settings, from the song alignment (scripts/align.py).\nconst PROJECT = { duration: ${a.duration.toFixed(2)}, bpm: ${a.tempo.toFixed(1)}, offset: ${a.offset.toFixed(3)}, audio: "assets/song.mp3" };\n`;
    require("fs").writeFileSync(process.argv[2], s); console.log(s.trim());' "$(cd "$(dirname "$ALIGN")" && pwd)/$(basename "$ALIGN")" "$MV/src/config.js"
else
  printf '// config.js: project settings (no song: the beat still drives every idle and bounce).\nconst PROJECT = { duration: %s, bpm: %s, offset: 0 };\n' "$SECONDS_" "$BPM" > "$MV/src/config.js"
  cat "$MV/src/config.js"
fi
LOGO_TAG=""
if [ -n "$LOGO" ]; then node "$SKILL/scripts/embed-logo.mjs" "$LOGO" "$MV"; LOGO_TAG='<script src="src/logo.js"></script>'; fi
node -e '
  const fs = require("fs"), [mv, logo] = process.argv.slice(1);
  let s = fs.readFileSync(mv + "/studio.html", "utf8");
  if (!s.includes("src/made.js")) {
    const kit = `<script src="src/lib.js"></script>\n<script src="src/made.js"></script>\n${logo ? logo + "\n" : ""}`;
    s = s.replace(/<!-- your video[^\n]*\n(<script src="src\/scenes\/[^"]+"><\/script>\n)*/, m => m.split("\n")[0] + "\n" + kit + "%SCENES%");
    if (!s.includes("%SCENES%")) { console.error("studio.html layout changed: add lib.js, made.js and the scene scripts by hand"); process.exit(1); }
  } else s = s.replace(/(<script src="src\/scenes\/[a-e]\.js"><\/script>\n)+/, "%SCENES%");
  const tag = k => `<script src="src/scenes/${k}.js"></script>\n`;
  fs.writeFileSync(mv + "/studio.html", s.replace("%SCENES%", "abcde".split("").map(tag).join("")));
  for (const k of "abcde") fs.writeFileSync(`${mv}/studio_${k}.html`, s.replace("%SCENES%", tag(k)));
  for (const k of "abcde") { const f = `${mv}/src/scenes/${k}.js`; if (!fs.existsSync(f)) fs.writeFileSync(f, `// ${k}.js: see STORYBOARD.md, file ${k}.\n`); }
  console.log("wrote studio.html and studio_a…e.html");' "$MV" "$LOGO_TAG"
echo "ready: $MV  (read $MV/ANIMATION_GUIDE.md, then write $MV/STORYBOARD.md)"
