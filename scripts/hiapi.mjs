// hiapi.mjs: the small HiAPI client every script here shares (Node 18+, no dependencies).
// The key comes from HIAPI_API_KEY (or a .env next to the skill); it is never printed or written to disk.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
function dotenv(name) {
  const f = join(root, '.env');
  if (!existsSync(f)) return undefined;
  const hit = readFileSync(f, 'utf8').split('\n').map(l => l.trim()).find(l => l.startsWith(name + '='));
  return hit ? hit.slice(name.length + 1).replace(/^["']|["']$/g, '') : undefined;
}
export const BASE = (process.env.HIAPI_BASE_URL || dotenv('HIAPI_BASE_URL') || 'https://api.hiapi.ai').replace(/\/$/, '');
export function apiKey() {
  const k = process.env.HIAPI_API_KEY || dotenv('HIAPI_API_KEY');
  if (!k || k === 'your_hiapi_api_key') throw new Error('HIAPI_API_KEY is required: create one at https://www.hiapi.ai/en/dashboard/api-keys');
  return k;
}

async function call(method, path, body, headers = {}) {
  const key = apiKey();
  const res = await fetch(BASE + path, {
    method, body: body === undefined ? undefined : JSON.stringify(body),
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...headers },
  });
  const text = await res.text();
  if (!res.ok) {
    const hint = { 401: 'check the API key', 403: 'check the API key', 402: 'top up the HiAPI balance', 429: 'rate limited: wait and retry' }[res.status] || '';
    throw new Error(`HiAPI ${method} ${path} → HTTP ${res.status}${hint ? ` (${hint})` : ''}: ${text.slice(0, 600)}`);
  }
  return JSON.parse(text);
}

// Claude (or any Anthropic-format text model) through HiAPI's /v1/messages.
export async function messages({ model = 'claude-opus-5-5', system, user, maxTokens = 4000 }) {
  const r = await call('POST', '/v1/messages', { model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] },
    { 'anthropic-version': '2023-06-01', 'x-api-key': apiKey() });
  return { text: (r.content || []).map(b => b.text || '').join(''), meta: { model: r.model, id: r.id, usage: r.usage } };
}

// The unified async task API: submit, then poll until success | fail.
export async function submitTask(model, input) {
  const r = await call('POST', '/v1/tasks', { model, input });
  const id = r?.data?.taskId;
  if (!id) throw new Error('HiAPI returned no taskId: ' + JSON.stringify(r).slice(0, 400));
  return id;
}
export async function pollTask(id, { everyMs = 10000, timeoutMs = 15 * 60000, onStatus } = {}) {
  const t0 = Date.now(); let last;
  for (;;) {
    const d = (await call('GET', `/v1/tasks/${id}`)).data;
    if (d.status !== last && onStatus) onStatus(d.status);
    last = d.status;
    if (d.status === 'success' || d.status === 'fail') return d;
    if (Date.now() - t0 > timeoutMs) throw new Error(`task ${id} still ${d.status} after ${timeoutMs / 60000} min: check GET /v1/tasks/${id} later`);
    await new Promise(r => setTimeout(r, everyMs));
  }
}
export async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${url} → HTTP ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

// --key=value flags
export function flags(argv = process.argv.slice(2)) {
  const o = { _: [] };
  for (const a of argv) { if (!a.startsWith('--')) { o._.push(a); continue; } const [k, ...v] = a.slice(2).split('='); o[k] = v.length ? v.join('=') : true; }
  return o;
}
