---
name: hiapi-hand-painted-animation
description: Make a hand-painted animated short about anything, in this exact look — watercolour brush strokes, ink outlines that boil from frame to frame, paper grain, flat 2D, motion locked to a beat, characters that act rather than pose. Use for animated shorts, explainers and stories told with drawn characters, lyric videos, animated ads and openings. Music and lyrics are optional: through HiAPI they can be written and sung, with subtitles and an end card.
---

# HiAPI Hand-Painted Animation

Anything a person can describe, told as a 1–3 minute hand-painted cartoon: `brief → script/storyboard → one scene file at a time
→ contact sheets → render → subtitles → end card`. Optionally with a song written and sung through HiAPI.

The reference short made with this skill is **"Made of Everything"** (2:37, 95.7 BPM, Clawd and friends at a desk):
`assets/examples/`.

## The look (this is what the skill is for)

Every frame must read as painted by hand, in this order of importance:

1. **Brush strokes, flat 2D, no lettering.** Shapes are painted with `paint()` (watercolour `fill` + flat `wash` + an
   ink outline); lines with `inkLine()`. Never a plain p5 `rect`/`ellipse`; never 3D, perspective or projected turns
   (characters turn through drawn key views).
2. **The linework boils.** `jit()`/`random()` are reseeded 12× a second, so everything wobbles slightly, like
   hand-drawn animation. Anything that must hold still uses `hash()`, and every element gets its own `boilSeed(key)`.
3. **Paper, not screen.** A paper texture and a grain/vignette are multiplied over the whole frame, so pigment sits
   *in* the paper. Never mix in digital gradients or glow: light is `glow()` only.
4. **Flat palette, no pure black or white** (`PAL.ink`, `PAL.cream`). Colours mix like pigment, so layer light over
   dark with a full-opacity `wash` or light it with `glow()`.
5. **Alive and on the beat.** `PROJECT.bpm` drives every idle, bounce and dance; nothing is ever frozen; emotions
   change through `emotions()` (anticipation, take, overshoot), never by swapping a face between frames.

The full craft — rules, animation principles, timing, the character kit, the review loop — is ClaudeAnimationBase's
`ANIMATION_GUIDE.md`, which `setup-animation.sh` puts in the project. **Read it completely before writing scene code.**

## Hard gates

- **Don't publish.** Never upload, post or schedule anything. Hand over the file; the user publishes.
- **Cost.** Say which music models you will run and roughly what it costs before the first paid call
  (`scripts/make-song.mjs --dry-run` is free). Lyrics first, song second, and show the lyrics to the user in between.
- **Honest credits.** Credit a model only for what it actually made. If lyrics or the song came through HiAPI, the end
  card may say so; if the animation was written by an agent that did not run through HiAPI, it does not say the whole
  film was made with HiAPI. Keep `lyrics.call.json` and the song's `*.task.json` as evidence.
- **Other people's work.** For a tribute or remake: new words, new pictures, credit the original creators, never reuse
  their audio or footage, and do not imitate a living artist's voice or name them in a style prompt.

## Workflow

### 1. Brief (with the user, a few minutes)
Agree on: the story in one sentence, who the characters are, the world, the length (1–3 min), the language, the
colour arc, and **whether it has a song** (if yes: genre, BPM, sung in which language). Write `brief.md`.
If the user has a logo they want to appear, note that too: paint it into the world as a prop and use it on the end card.

### 2. Only if there is a song: lyrics, then the song
```bash
node scripts/write-lyrics.mjs --brief=brief.md --out=<project>/song          # Claude through HiAPI → lyrics.txt, style.txt
node scripts/make-song.mjs --lyrics=<project>/song/lyrics.txt --style=<project>/song/style.txt \
  --out=<project>/song --models=minimax-music-2.6,lyria-3.5 --bpm=95 --seconds=160 [--dry-run first]
uv run --with faster-whisper --with librosa python scripts/align.py <project>/song/mm26-0.mp3 <project>/song/lyrics.txt
```
Show the lyrics before paying. Run `align.py` on every take: it prints a lyric match score per take (a take that
skipped lines scores low) plus tempo and first beat, and writes `<audio>.lines.tsv` with each line's start and end.
Pick the best take and listen to it.

### 3. Project
```bash
scripts/setup-animation.sh <project> [--song=<project>/song/mm26-0.mp3] [--logo=logo.png] [--seconds=90 --bpm=100]
```
Clones ClaudeAnimationBase (MIT) into `<project>/mv`, installs it, patches it (`PRELOAD`, `TYPE_LAYER`, per-scene
studio pages), copies the reference kit (`src/lib.js`, `src/made.js`), sets the tempo from the alignment (or 100 BPM if
there is no song), copies the audio, embeds a logo if given, and writes `studio.html` + `studio_a–e.html`.
**Then read `<project>/mv/ANIMATION_GUIDE.md` in full.**

### 4. Storyboard — show the user before building
Write `<project>/mv/STORYBOARD.md`: logline, the one world, colour arc, cast, motifs, and a table splitting the film
into 4–6 scene files at natural act breaks, each seam a transition with the same colours on both sides. Then per shot:
what the viewer must read, in order, and how long each read needs (`assets/examples/made-of-everything/STORYBOARD.md` is the model).
Timing comes from the song's `lines.tsv` when there is one, and from the reads themselves when there is not.
Anything the film says in words belongs in narration/subtitles or in a post — never as lettering inside a shot.

### 5. Build one scene file at a time, and look at it
- `src/scenes/<x>.js` registers `shots([[t0, fn], ...])`; each `fn(t, lt, dur)` paints the whole frame and must be a
  pure function of `t` (frames render out of order).
- Reuse the kit: `studio(t, o)` (the one room), `mind()` (the band of Clawds), `slip()`, `page()`, `filmStrip()`,
  `crane()`, `swirl()`, and the wipes. Paint new props with the same tools.
- After each file, render a contact sheet and **look at the picture**:
  `node render.mjs --page=studio_<x>.html --sheet=t1,t2,... --cols=6 --w=480 --out=out/check/<x>.jpg`
- Fix what you see (crowding, overlaps, a prop not touching a hand, colours reverting, text) and re-check.
- Scene files are independent, so parallel workers can take one file each with its storyboard section and studio page;
  review every sheet yourself — a sheet that "looks fine" at 480 px still hides overlaps.

### 6. Ending
Crisp type and logos go in `window.TYPE_LAYER = (c, t) => {...}` with fonts/logos added to `window.PRELOAD`
(`templates/example-ending.js`). Keep the camera still while type is on screen, or it detaches from the world.

### 7. Render and subtitles
```bash
scripts/assemble.sh <project> <project>/post/<name>_final.mp4 [<project>/song/<take>.lines.tsv]
```
0.1–0.2 s per frame with 4 workers (a 2:30 film ≈ 8–12 min), resumable. Then verify: duration equals the song (or the
intended length), an audio stream exists if there should be one, and a 3×3 sheet of frames from the final file shows
scenes, subtitles and the end card.

### 8. Hand over
Final path, what was verified and what was not (e.g. "not watched end to end"), the cost, and a draft post with honest
credits. `references/gotchas.md` lists every failure met while making the reference film — read it before you start.
