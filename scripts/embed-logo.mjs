#!/usr/bin/env node
// embed-logo.mjs: a brand logo PNG → src/logo.js, as a data URL (a file:// image would taint the canvas and break
// rendering). Defines BRAND_LOGO (an Image) and adds its decode() to window.PRELOAD, so no frame renders before it loads.
//   node scripts/embed-logo.mjs logo.png <project dir>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [png, dir] = process.argv.slice(2);
if (!png || !dir) { console.error('usage: embed-logo.mjs logo.png <project dir>'); process.exit(1); }
const b64 = readFileSync(png).toString('base64');
writeFileSync(join(dir, 'src/logo.js'), `// logo.js: the brand logo, embedded as a data URL (a file:// image would taint the canvas). Made by embed-logo.mjs.
const BRAND_LOGO = new Image();
BRAND_LOGO.src = 'data:image/png;base64,${b64}';
window.PRELOAD = (window.PRELOAD || []).concat([BRAND_LOGO.decode()]);
`);
console.log(`wrote ${join(dir, 'src/logo.js')} (${Math.round(b64.length / 1024)} KB)`);
