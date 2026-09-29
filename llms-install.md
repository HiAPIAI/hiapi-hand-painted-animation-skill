# Agent installation

1. Install:
   ```bash
   npx -y github:HiAPIAI/hiapi-hand-painted-animation-skill -y
   ```
   If no agent is detected, pass `--codex`, `--claude`, or `--target=/absolute/path/to/skills`.
2. If the user wants lyrics or a song, set `HIAPI_API_KEY` in the environment that starts the agent
   (create one at <https://www.hiapi.ai/en/dashboard/api-keys>). The animation itself needs no key.
3. Check the tools: `node -v` (18+), `ffmpeg -version`, `uv --version`, `git --version`, and Google Chrome or Chromium.
4. Read the installed `SKILL.md` completely, then `references/gotchas.md`. After `setup-animation.sh`, read the
   project's `mv/ANIMATION_GUIDE.md` in full before writing any scene code.
5. Show the user the storyboard before building. Before a paid song, show the lyrics and the estimated cost, and run
   `make-song.mjs --dry-run` first.
6. Do not report completion from a render log: verify the final MP4 (duration, audio stream, a frame sheet).
7. Never publish or upload; hand the file to the user.
