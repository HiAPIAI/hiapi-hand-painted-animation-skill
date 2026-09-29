#!/usr/bin/env node
// patch-base.mjs: the small, idempotent changes this skill needs in a ClaudeAnimationBase checkout.
//   node scripts/patch-base.mjs <project dir>
//   core.js   window.PRELOAD (promises the page waits for before rendering: fonts, logos) and window.TYPE_LAYER(c, t)
//             (crisp type and logos drawn after the painting, still under the paper grain: credits, the brand lockup)
//   render.mjs --page=<studio page> (one page per scene file while building), and each render tab is brought to the front
//             while it loads (a background tab can stall font loading and time out a worker)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: patch-base.mjs <ClaudeAnimationBase dir>'); process.exit(1); }
const edits = [
  ['src/core.js', `  await document.fonts.load('100px "Permanent Marker"');\n`, `  await document.fonts.load('100px "Permanent Marker"');\n  if (window.PRELOAD) await Promise.all(window.PRELOAD);\n`, 'window.PRELOAD'],
  ['src/core.js', `  drawLetters(c);\n  c.globalCompositeOperation = 'multiply';`, `  drawLetters(c);\n  if (window.TYPE_LAYER) window.TYPE_LAYER(c, t);   // crisp type/logos, still under the paper grain\n  c.globalCompositeOperation = 'multiply';`, 'window.TYPE_LAYER'],
  ['render.mjs', `resolve('studio.html')`, `resolve(args.page || 'studio.html')`, 'args.page ||'],
  ['render.mjs', `  await page.waitForFunction('window.ready === true', { timeout: 60000 });`, `  await page.bringToFront();\n  await page.waitForFunction('window.ready === true', { timeout: 180000 });`, 'bringToFront'],
];
let bad = 0;
for (const [file, from, to, mark] of edits) {
  const p = join(dir, file); let s = readFileSync(p, 'utf8');
  if (s.includes(mark)) { console.log(`ok    ${file}: ${mark} (already)`); continue; }
  if (!s.includes(from)) { console.error(`FAIL  ${file}: anchor for ${mark} not found (the base changed; apply it by hand)`); bad++; continue; }
  writeFileSync(p, s.replace(from, to)); console.log(`patch ${file}: ${mark}`);
}
process.exit(bad ? 1 : 0);
