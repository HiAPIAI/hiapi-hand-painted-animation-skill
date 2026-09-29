# Hand-Painted Animation Skill

**Tell your coding agent an idea. Get back a hand-painted cartoon.**

Languages: [English](README.md) | [简体中文](README.zh-CN.md) · AI agent? Read [llms-install.md](llms-install.md) first.

An agent skill for Claude Code, Codex and other coding agents. It writes the storyboard, paints every shot in code,
checks its own frames, and renders an MP4 in one consistent look: watercolour brush, wobbling ink lines, paper grain.
Want a song? It writes the lyrics and gets them sung through [HiAPI](https://www.hiapi.ai/en), then times every line
to the beat, with subtitles.

## Made with this skill

**Made of Everything** · 2:37 — a song about how the song itself was made.

https://github.com/user-attachments/assets/c0a859d2-95c3-4aae-8ab6-8f7fd014c293

**Just One More Prompt** · 2:26 — a night of "just one more prompt" with Claude Code.

https://github.com/user-attachments/assets/17f75db1-cbd7-48ab-84fc-8d7c246716b6

## Install

```bash
npx -y github:HiAPIAI/hiapi-hand-painted-animation-skill -y
export HIAPI_API_KEY=your_key   # only for lyrics and songs: https://www.hiapi.ai/en/dashboard/api-keys
```

Needs node 18+, ffmpeg, [uv](https://docs.astral.sh/uv/), git and Google Chrome or Chromium.

## Ask for anything

- "Make a 90-second hand-painted short about a cat who keeps a lighthouse."
- "Explain how a CPU cache works as a one-minute cartoon."
- "Make an animated song for our team's first birthday: indie pop, English, Chinese subtitles."

The agent agrees the idea with you, shows you the storyboard before building (and the lyrics before paying for a song),
builds the film one scene at a time while looking at every contact sheet, and hands you the MP4. It never publishes.

## The look

Every frame is painted with [p5.brush](https://github.com/acamposuribe/p5.brush): flat colour and watercolour washes
with ink outlines, lines that re-draw slightly 12 times a second like hand-drawn animation, a paper texture over
everything, no 3D, no lettering in the picture. Characters act (anticipation, takes, overshoot) and everything moves on
one beat. The engine and the craft guide come from [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase).

## About the examples

The storyboards of both videos above, and timed lyrics, are in [`assets/examples/`](assets/examples/).
*Just One More Prompt* is a tribute to "I'm Upping My P(doom)" (lyrics osmarks, Suno version @slimer48484, MV
@other__reality); its words, music and pictures are new.

## Scripts

| script | does |
|---|---|
| `setup-animation.sh` | sets up a project: engine, kit, tempo, optional song and logo |
| `assemble.sh` | renders every frame, adds the audio, burns subtitles |
| `write-lyrics.mjs` | idea → lyrics and a style prompt, through HiAPI |
| `make-song.mjs` | lyrics → a sung song through HiAPI, several takes in parallel |
| `align.py` | tempo, first beat, and each lyric line's timing |

## License

MIT. Builds on ClaudeAnimationBase by John Heibel (MIT).
