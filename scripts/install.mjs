#!/usr/bin/env node
// install.mjs: npx -y github:HiAPIAI/hiapi-hand-painted-animation-skill -y  → clones this skill into the agent's skills directory.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { argv, env, exit } from 'node:process';

const NAME = 'HiAPI Hand-Painted Animation Skill', FOLDER = 'hiapi-hand-painted-animation', REPO = 'https://github.com/HiAPIAI/hiapi-hand-painted-animation-skill.git';
const args = argv.slice(2), flag = n => { const h = args.find(a => a.startsWith(`--${n}=`)); return h ? h.split('=')[1].replace(/^~(?=$|\/)/, homedir()) : null; };
function targets() {
  const explicit = flag('target') || flag('skills-dir') || env.AGENT_SKILLS_DIR;
  if (explicit) return [explicit];
  const codex = join(env.CODEX_HOME || join(homedir(), '.codex'), 'skills'), claude = join(homedir(), '.claude', 'skills');
  if (args.includes('--codex')) return [codex];
  if (args.includes('--claude')) return [claude];
  const found = [[join(homedir(), '.codex'), codex], [join(homedir(), '.claude'), claude]].filter(([h]) => existsSync(h)).map(([, d]) => d);
  if (!found.length) throw new Error('No agent skills directory detected. Pass --codex, --claude, or --target=/path/to/skills.');
  return found;
}
try {
  execFileSync('git', ['--version'], { stdio: 'ignore' });
  for (const dir of targets()) {
    mkdirSync(dir, { recursive: true });
    const dest = join(dir, FOLDER);
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    console.log(`[${NAME}] Installing → ${dest}`);
    execFileSync('git', ['clone', '--depth', '1', REPO, dest], { stdio: 'inherit' });
  }
  console.log(env.HIAPI_API_KEY ? `[${NAME}] HIAPI_API_KEY is set.` : `[${NAME}] HIAPI_API_KEY is not set (only needed for lyrics and songs). Get a key: https://www.hiapi.ai/en/dashboard/api-keys`);
  console.log(`[${NAME}] Also needed: node 18+, ffmpeg, uv (Python), git, and Google Chrome or Chromium. Restart the agent if it caches skills.`);
} catch (e) { console.error(`[${NAME}] Failed: ${e.message}`); exit(1); }
