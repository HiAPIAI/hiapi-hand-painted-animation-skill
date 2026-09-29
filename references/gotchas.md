# Gotchas (all met while making the reference film)

**Song and timing**
- Whisper mishears names ("Claude" → "Cod"): judge takes by the match score and listening, not single words.
- Lyrics-to-song models sometimes drop or repeat lines: `align.py` lists lines "not heard".
- HiAPI output URLs expire (about 7 days): download immediately (make-song.mjs does).

**Animation (ClaudeAnimationBase)**
- `--range=a:b` uses a colon; `--range=0-56.8` renders nothing.
- `--encode` needs `--audio=assets/song.mp3`, or the MP4 is silent.
- p5 puts many names in the global scope: a global called `OVERLAY`, `cross`, etc. collides with p5. Use `TYPE_LAYER`, prefix your helpers.
- `emotions()` cross-fades colour starting from Clawd's clay: a recoloured character reverts to orange during every
  emotion change unless you pass its colours after the spread (`mind()` in made.js does).
- A group of characters at size `u` is `10u` wide each: space them at least `10.5u` apart, and keep walking order
  (don't let a walk cross another character).
- Wide soft `dry` brush strokes at weight 7+ become blobs: use weight 2–3 plus an `ink` line.
- A render worker whose tab loads in the background can stall on font loading and time out after 60 s, killing the
  whole run (patch-base.mjs brings each tab to the front and waits 180 s). Rendering is resumable: just rerun.
- Keep the story out of the bottom ~180 px: subtitles go there.
- Crisp text (credits) needs a still camera (`camBegin(960, 540, 1)`) while it shows, or it detaches from the world.

**Shell**
- Some agent harnesses block foreground `sleep`: run long renders in the background and wait with an `until` loop.
