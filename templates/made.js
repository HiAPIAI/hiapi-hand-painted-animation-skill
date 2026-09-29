// made.js: the reference kit of "Made of Everything": the round door (a mark painted as a six-paned window), the "minds" (Clawd plus four coloured friends), the prompt slip, lamp, wall clock, mug, paper map, film strip, paper crane, song scroll, and studio(t, o), the one room every scene reuses.

const HI = { teal: '#3AB5BE', tealDk: '#2A8A92', tealLt: '#8FD8DC', orange: '#F99F2A', light: '#FFE3A8' };

// ---------- the round door: a logo mark painted as a six-paned round window ----------
// A circle cut by two vertical bands and one band sloping up to the right: six panes. (x, y) = centre, r = radius.
// open 0..1 swings the panes flat against the left hinge (2D: they squash toward the left edge) and shows the light.
function clipHalf(P, a, b, c) {   // keep points with a*x + b*y <= c (Sutherland-Hodgman, one edge)
  const out = [], inside = p => a * p[0] + b * p[1] <= c + 1e-9;
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], ip = inside(p), iq = inside(q);
    if (ip) out.push(p);
    if (ip !== iq) { const d = (a * q[0] + b * q[1]) - (a * p[0] + b * p[1]), k = (c - (a * p[0] + b * p[1])) / d; out.push([lerp(p[0], q[0], k), lerp(p[1], q[1], k)]); }
  }
  return out;
}
function doorPanes(r) {
  const circ = ellPts(0, 0, r, r, 48), S = .27, G = .13 * r, cols = [[-9, -.5], [-.25, .25], [.5, 9]], panes = [];
  for (const [x0, x1] of cols) for (const row of [-1, 1]) {
    let P = clipHalf(circ, -1, 0, -x0 * r); P = clipHalf(P, 1, 0, x1 * r);
    // the band: y = -S x; upper pane keeps y + S x <= -G, lower keeps -(y + S x) <= -G
    P = row < 0 ? clipHalf(P, S, 1, -G) : clipHalf(P, -S, -1, -G);
    if (P.length > 2) panes.push(P);
  }
  return panes;
}
function markDoor(x, y, r, open = 0, lit = 0, o = {}) {
  boilSeed('door' + (o.key || ''));
  const L = clamp(lit + open * .8);
  if (L > .02) glow(x, y, r * (1.6 + L), '#FFD58A', .7 * L);
  // the frame: a round hole in the wall, lit from within when open
  paint(ellPts(x, y, r * 1.08, r * 1.08, 40), { wash: mixCol(o.wall || '#2B2F55', PAL.ink, .3), ink: PAL.ink, sw: clamp(r / 110, .5, 1.6) });
  // behind the panes: the cream muntins of the mark while shut, a room of warm light once open
  paint(ellPts(x, y, r, r, 40), { wash: mixCol(PAL.cream, HI.light, clamp(open * 1.5)), fill: '#FFF1CC', fillOp: 90 * clamp(open), bleed: .15, tex: .4, ink: null });
  const k = 1 - ease(clamp(open));
  if (k > .03) {
    push(); translate(x - r, y); scale(k, 1); translate(r, 0);   // hinge on the left edge
    doorPanes(r).forEach((P, i) => {
      boilSeed('pane' + i + (o.key || ''));
      paint(P, { wash: mixCol(HI.teal, '#9FE3E6', .3 * lit), fill: HI.tealDk, fillOp: 25, tex: .4, ink: PAL.ink, sw: clamp(r / 140, .4, 1.3) });
      if (o.pane) { const c = P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length], [0, 0]); o.pane(i, c[0], c[1], P); }
    });
    pop();
  }
}

// ---------- the minds ----------
// mind(kind, x, y, u, o): Clawd plus four friends, each a colour and a hat. kind: clawd | voice | strings | drum | painter
const MINDS = {
  clawd:   { },
  voice:   { col: '#4FB6B0', dk: '#2F8580', lt: '#9EDCD6', hat: 'headphones' },
  strings: { col: '#E27A92', dk: '#B24E68', lt: '#F4B3C2', hat: 'bow' },
  drum:    { col: '#E8AA38', dk: '#B27A1C', lt: '#F6D38A', hat: 'sweatband' },
  painter: { col: '#8E6CC0', dk: '#63469A', lt: '#C4AEE6', hat: 'beanie' },
};
// emotions() cross-fades colours starting from clay, so a friend's own colours always win (and tints are dropped)
function mind(kind, x, y, u, o = {}) {
  const M = MINDS[kind], c = M.col ? { col: M.col, dk: M.dk, lt: M.lt, tint: null } : {};
  clawd(x, y, u, { hat: M.hat, boilKey: kind, ...o, ...c });
}

// hand props (hooks at the arm tip, arm space: x runs outward along the arm)
const PROP = {
  quill: (u, sw) => { paint(ribbon([[0, 0], [.8 * u, -2.2 * u], [1.2 * u, -4.2 * u]], .2 * u, 1.3 * u), { wash: PAL.cream, fill: '#D9CDB8', fillOp: 80, ink: PAL.ink, sw: sw * .6 }); inkLine([[0, 0], [1.1 * u, -3.8 * u]], sw * .5, PAL.ink, 'inkfine', .3); },
  brush: (u, sw) => { paint(rectPts(-.2 * u, -3.4 * u, .4 * u, 3.4 * u), { wash: '#B07A52', ink: PAL.ink, sw: sw * .5 }); paint(ribbon([[0, -3.3 * u], [0, -4.4 * u], [.1 * u, -5 * u]], .55 * u, .1 * u), { wash: PAL.clay, ink: PAL.ink, sw: sw * .5 }); },
  mic: (u, sw) => { paint(rectPts(-.25 * u, -2.2 * u, .5 * u, 2.2 * u), { wash: '#4A4A5E', ink: PAL.ink, sw: sw * .5 }); paint(ellPts(0, -2.7 * u, .75 * u, .8 * u, 14), { wash: '#C9C3D6', ink: PAL.ink, sw: sw * .6 }); },
  bow: (u, sw) => { inkLine([[-.3 * u, .4 * u], [2.8 * u, -3.4 * u]], sw * .9, '#8A5A3C', 'ink', 0); inkLine([[-.1 * u, .6 * u], [3 * u, -3.1 * u]], sw * .4, PAL.cream, 'inkfine', 0); },
  stick: (u, sw) => { inkLine([[0, 0], [1.6 * u, -2.2 * u]], sw * 1.1, '#B07A52', 'ink', 0); paint(ellPts(1.7 * u, -2.35 * u, .38 * u, .38 * u, 10), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 }); },
  slip: (u, sw) => { push(); rotate(-.3); paint(rectPts(-.2 * u, -1.6 * u, 2.6 * u, 1.7 * u, u * .03), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 }); inkLine([[.2 * u, -1.1 * u], [1.9 * u, -1.1 * u]], sw * .4, '#7A6E80', 'inkfine', 0); inkLine([[.2 * u, -.6 * u], [1.3 * u, -.6 * u]], sw * .4, '#7A6E80', 'inkfine', 0); pop(); },
};

// ---------- the prompt slip: a small folded note with one written line and a caret ----------
function slip(x, y, s, rot = 0, o = {}) {
  boilSeed('slip' + (o.key || ''));
  if (o.glow) glow(x, y, s * 3, '#FFD58A', o.glow);
  push(); translate(x, y); rotate(rot); if (o.flap != null) scale(1, lerp(1, .25, Math.abs(Math.sin(o.flap))));
  paint(rectPts(-s, -s * .62, s * 2, s * 1.24, s * .02), { wash: PAL.cream, fill: PAL.paper, fillOp: 90, tex: .4, ink: PAL.ink, sw: clamp(s / 40, .4, 1.3) });
  inkLine([[-s * .7, -s * .12], [-s * .5, 0], [-s * .7, s * .12]], clamp(s / 30, .5, 1.6), PAL.clay, 'ink', 0);
  inkLine([[-s * .35, 0], [s * .35 * clamp(o.write ?? 1) * 2 - s * .35, 0]], clamp(s / 34, .4, 1.4), PAL.ink, 'inkfine', 0);
  pop();
}

// ---------- the lamp (x, y = foot on the desk) ----------
function lamp(x, y, s, on = 1) {
  boilSeed('lamp');
  const hx = x + 60 * s, hy = y - 230 * s;
  if (on > .02) glow(hx + 30 * s, hy + 150 * s, 360 * s, '#FFC766', .8 * on);
  paint(ellPts(x, y - 8 * s, 55 * s, 14 * s, 18), { wash: '#4A4A5E', ink: PAL.ink, sw: clamp(s, .5, 1.3) });
  inkLine([[x, y - 12 * s], [x - 30 * s, y - 130 * s], [hx, hy]], clamp(s * 2.2, .8, 3), '#4A4A5E', 'ink', 0);
  push(); translate(hx, hy); rotate(.5);
  paint([[-40 * s, 0], [40 * s, 0], [70 * s, 70 * s], [-70 * s, 70 * s]], { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: clamp(s, .5, 1.3) });
  paint(ellPts(0, 72 * s, 40 * s, 14 * s, 14), { wash: mixCol('#6A5A40', '#FFF1C0', on), ink: null });
  pop();
}

// ---------- the wall clock (hands at h:m) ----------
function wallClock(x, y, r, h, m) {
  boilSeed('clock');
  paint(ellPts(x, y, r, r, 30), { wash: PAL.cream, fill: PAL.paper, fillOp: 80, ink: PAL.ink, sw: clamp(r / 60, .5, 1.4) });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78], [x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9]], clamp(r / 70, .4, 1), PAL.ink, 'inkfine', 0); }
  const ah = (h % 12 + m / 60) / 12 * TAU, am = m / 60 * TAU;
  inkLine([[x, y], [x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5]], clamp(r / 30, .8, 2.4), PAL.ink, 'ink', 0);
  inkLine([[x, y], [x + Math.sin(am) * r * .75, y - Math.cos(am) * r * .75]], clamp(r / 45, .6, 1.8), PAL.clay, 'ink', 0);
}

// ---------- a mug; steam 0..1 (the coffee cooling) ----------
function mug(x, y, s, steam = 1, t = T) {
  boilSeed('mug');
  paint(rrPts(x - 34 * s, y - 70 * s, 68 * s, 70 * s, 10 * s), { wash: HI.teal, fill: HI.tealDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: clamp(s, .5, 1.3) });
  paint(ribbon([[x + 32 * s, y - 55 * s], [x + 58 * s, y - 40 * s], [x + 32 * s, y - 18 * s]], 10 * s, 10 * s), { wash: HI.teal, ink: PAL.ink, sw: clamp(s * .8, .4, 1) });
  for (let i = 0; i < 3; i++) {
    const k = clamp(steam * 1.3 - i * .25); if (k < .05) continue;
    const bx = x + (i - 1) * 16 * s, ph = t * 1.4 + i * 2;
    inkLine([0, 1, 2, 3].map(j => [bx + Math.sin(ph + j * 1.3) * 8 * s, y - 80 * s - j * 26 * s * k]), clamp(s * 1.3, .5, 1.6), mixCol('#FFFFFF', PAL.paper, .3), 'dry', .7);
  }
}

// ---------- a sheet that becomes a map: rows of writing, then a dotted route with a star ----------
function paperMap(x, y, w, h, write, route, o = {}) {
  boilSeed('map' + (o.key || ''));
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  paint(rectPts(-w / 2, -h / 2, w, h, 3), { wash: PAL.cream, fill: '#E9DCC0', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
  inkLine([[-w / 6, -h / 2], [-w / 6 + 6, h / 2]], .6, '#CDBF9E', 'inkfine', 0); inkLine([[w / 6, -h / 2], [w / 6 - 4, h / 2]], .6, '#CDBF9E', 'inkfine', 0);
  const rows = 8, shown = write * rows;
  for (let r = 0; r < rows; r++) {
    const k = clamp(shown - r); if (k <= 0) break;
    const yy = -h / 2 + 38 + r * (h - 70) / rows, ww = (w - 90) * (.55 + .4 * hash(r + 5));
    const pts = []; for (let i = 0; i <= 10 * k; i++) pts.push([-w / 2 + 40 + ww * i / 10, yy + Math.sin(i * 1.7 + r) * 4]);
    if (pts.length > 1) inkLine(pts, 1.1, '#6A5E70', 'inkfine', .6);
  }
  if (route > 0) {   // the route: a dashed path wandering across the lines, ending at a star
    const P = [[-w * .36, h * .32], [-w * .1, h * .1], [-w * .22, -h * .12], [w * .08, -h * .2], [w * .3, -h * .05], [w * .34, -h * .3]];
    const seg2 = (P.length - 1) * clamp(route);
    for (let i = 0; i < seg2 * 3; i++) {
      const f = i / 3, j = Math.floor(f), a = P[j], b = P[Math.min(j + 1, P.length - 1)], q = f - j, q2 = Math.min(1, q + .18);
      inkLine([[lerp(a[0], b[0], q), lerp(a[1], b[1], q)], [lerp(a[0], b[0], q2), lerp(a[1], b[1], q2)]], 2, PAL.clay, 'ink', 0);
    }
    if (route > .95) { const s = 18 * backOut(seg(route, .95, 1.1)); paint(starPts(P[5][0], P[5][1], s, .42, 5), { wash: PAL.ochre, ink: PAL.ink, sw: .7 }); }
  }
  pop();
}

// ---------- film strip: n frames across; draw(i, x, y, w, h) paints each frame's picture ----------
function filmStrip(x, y, fw, fh, n, reveal, draw, o = {}) {
  boilSeed('strip' + (o.key || ''));
  const W2 = n * (fw + 24) + 24;
  paint(rectPts(x, y - 34, W2, fh + 68, 2), { wash: '#3B3550', ink: PAL.ink, sw: 1 });
  for (let i = 0; i < n * 3 + 1; i++) for (const yy of [y - 22, y + fh + 10]) paint(rrPts(x + 12 + i * (W2 - 24) / (n * 3), yy, 14, 12, 3), { wash: PAL.paper, ink: null });
  for (let i = 0; i < n; i++) {
    const fx = x + 24 + i * (fw + 24);
    boilSeed('frame' + i + (o.key || ''));
    paint(rectPts(fx, y, fw, fh, 1), { wash: PAL.paper, ink: null });
    const k = clamp(reveal - i);
    if (k > 0) { push(); draw(i, fx, y, fw, fh, k); pop(); }
  }
}

// ---------- a paper crane (x, y centre, s size, flap phase) ----------
function crane(x, y, s, flap = 0, o = {}) {
  boilSeed('crane' + (o.key || ''));
  const w = Math.sin(flap) * .8;
  const sw = clamp(s / 60, .4, 1.3), col = o.col || PAL.cream;
  push(); translate(x, y); if (o.flip) scale(-1, 1); if (o.rot) rotate(o.rot);
  paint([[-s * .1, 0], [-s * .9, -s * (.2 + w)], [s * .15, -s * .1]], { wash: mixCol(col, '#D9CDB8', .5), ink: PAL.ink, sw });
  paint([[-s, s * .05], [-s * .2, s * .15], [s * .5, s * .1], [s * .9, -s * .5], [s * .65, s * .05], [s * .2, s * .3], [-s * .3, s * .25]], { wash: col, fill: '#D9CDB8', fillOp: 60, tex: .3, ink: PAL.ink, sw });
  paint([[-s * .05, s * .05], [s * .6, -s * (.5 + w * 1.1)], [s * .3, s * .12]], { wash: col, ink: PAL.ink, sw });
  pop();
}

// ---------- a golden string laid across the air (verse 2): k 0..1 draws it on ----------
function goldString(x0, y0, x1, y1, k, t, key) {
  if (k <= 0) return;
  boilSeed('gold' + key);
  const P = []; for (let i = 0; i <= 12 * k; i++) { const f = i / 12; P.push([lerp(x0, x1, f), lerp(y0, y1, f) + Math.sin(f * Math.PI) * 30 + Math.sin(t * 6 + f * 9 + key) * 4 * f]); }
  if (P.length > 1) { glow(P[P.length - 1][0], P[P.length - 1][1], 60, '#FFD27A', .5); inkLine(P, 2.2, '#F2C14E', 'ink', .7); }
}

// a hand-waving helper for clawd's aR: a wave that starts at t0
const waveArm = (t, t0, base = .2) => t < t0 ? base : lerp(base, 1.2 + .35 * Math.sin((t - t0) * 9), ease(seg(t, t0, t0 + .25)));

// ---------- the shared wipes of this film ----------
const WIPE_TEAL = [HI.tealDk, HI.teal];
const WIPE_GOLD = ['#C98A2E', '#F2C14E'];
const WIPE_PAPER = ['#CDBF9E', PAL.cream];
const WIPE_DAWN = [PAL.clay, '#F4C58A'];

// ---------- the room of this film (one layout, every scene) ----------
//   window top-left, lamp and Dev on the left, the monitor in the middle with the clock above it, the round door on
//   the right wall above the free end of the desk, where the minds stand.
const RM = { DESK: 700, DEVX: 470, DEVU: 16, DOOR: [1600, 400, 175], LAMP: [240, 700], MUG: [120, 700], CLOCK: [960, 110, 58], WIN: [60, 70] };
// studio(t, o): o.warm 0..1 (night → dawn), o.lamp 0..1, o.screen 0..1, o.content(x,y,w,h), o.clock [h, m], o.steam,
//   o.open / o.lit / o.pane (the door), o.dev (dev() options, or false to hide), o.press / o.glowKey (the Enter key),
//   o.dark 0..1 (a night wash over everything before the lamp comes on). Draw characters after it; o.after(t) runs
//   before the desk front panel (for things that stand behind the desk top).
function studio(t, o = {}) {
  const warm = o.warm || 0;
  room(t, warm, { wx: RM.WIN[0], wy: RM.WIN[1] });
  wallClock(...RM.CLOCK, ...(o.clock || [2, 30]));
  markDoor(...RM.DOOR, o.open || 0, o.lit ?? .15, { pane: o.pane, wall: mixCol(JP.room, '#C98A6A', warm * .6) });
  if (o.behind) o.behind(t);
  if (o.dev !== false) {
    const d = o.dev || {};
    dev(d.x ?? RM.DEVX, RM.DESK + 9 * RM.DEVU + (d.drop || 0), RM.DEVU, { sit: true, noShadow: true, lookX: .6, boilKey: 'studiodev', ...d });
  }
  desk(t, { x: 960, y: RM.DESK, screen: o.screen ?? 1, content: o.content, kbDx: -150, press: o.press || 0, enterGlow: o.glowKey || 0, screenCol: o.screenCol });
  boilSeed('deskfront');
  paint(rectPts(60, RM.DESK + 58, 1800, 400, 2), { wash: mixCol(JP.deskDk, '#8A5A3C', warm * .4), fill: JP.desk, fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.1 });
  inkLine([[960, RM.DESK + 70], [960, RM.DESK + 330]], .8, PAL.ink, 'inkfine', 0);
  lamp(...RM.LAMP, 1, o.lamp ?? 1);
  mug(...RM.MUG, 1, o.steam ?? .6, t);
  if (o.dark > .01) { boilSeed('dark'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#0E1026', washOp: 200 * o.dark, ink: null }); }
}

// eyes peeking in a door pane: a soft patch of the mind's colour, two eyes that blink and glance. k 0..1 pops them in.
function paneEyes(cx, cy, s, k, col, seed, t, look = 0) {
  if (k <= .02) return;
  boilSeed('peye' + seed);
  const p = backOut(k);
  paint(ellPts(cx, cy, s * 1.5 * p, s * .9 * p, 16), { fill: col, fillOp: 170, bleed: .15, tex: .3, ink: null });
  const blink = frac(t * .45 + seed * .37) < .05, lx = (look + .25 * Math.sin(t * 1.3 + seed)) * s * .18;
  for (const d of [-1, 1]) {
    if (blink) inkLine([[cx + d * s * .45 - s * .18, cy], [cx + d * s * .45 + s * .18, cy]], clamp(s / 30, .5, 1.4), PAL.ink, 'ink', 0);
    else { paint(ellPts(cx + d * s * .45 + lx, cy, s * .17 * p, s * .3 * p, 10), { wash: PAL.ink, ink: null }); paint(ellPts(cx + d * s * .45 + lx + s * .05, cy - s * .12, s * .06, s * .07, 6), { wash: PAL.cream, ink: null }); }
  }
}
const MIND_COLS = ['#4FB6B0', '#E27A92', '#E8AA38', '#8E6CC0', PAL.clay, '#6CC98A'];

// a point k (0..1) along a polyline, and its direction
function along(P, k) {
  const L = []; let tot = 0;
  for (let i = 0; i < P.length - 1; i++) { const d = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); L.push(d); tot += d; }
  let s = clamp(k) * tot;
  for (let i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { const f = L[i] ? clamp(s / L[i]) : 0; return { x: lerp(P[i][0], P[i + 1][0], f), y: lerp(P[i][1], P[i + 1][1], f), a: Math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0]) }; } s -= L[i]; }
}
// footprints walking along a path: n pairs, the first k of them printed
function footprints(P, n, k, s, col = PAL.clayDk) {
  for (let i = 0; i < n * k; i++) {
    const q = along(P, i / (n - 1)), side = i % 2 ? 1 : -1, nx = -Math.sin(q.a) * side * s * .6, ny = Math.cos(q.a) * side * s * .6;
    boilSeed('fp' + i);
    paint(ellPts(q.x + nx, q.y + ny, s * .55, s * .32, 10, 0, q.a), { wash: col, washOp: 220, ink: null });
  }
}
// a painted eighth note
function note(x, y, s, col = PAL.ink, rot = 0, key = '') {
  boilSeed('note' + key);
  push(); translate(x, y); rotate(rot);
  paint(ellPts(0, 0, s * .55, s * .4, 12, 0, -.4), { wash: col, ink: PAL.ink, sw: clamp(s / 40, .4, 1) });
  inkLine([[s * .5, -s * .1], [s * .5, -s * 1.8]], clamp(s / 22, .6, 2), PAL.ink, 'ink', 0);
  inkLine([[s * .5, -s * 1.8], [s * 1.1, -s * 1.3], [s * 1.0, -s * .9]], clamp(s / 22, .6, 2), PAL.ink, 'ink', .6);
  pop();
}
// the song as a scroll: two rods and a sheet between them with rows of notes; len = unrolled width (px), s = height scale
function songScroll(x, y, len, s, t, o = {}) {
  boilSeed('scroll' + (o.key || ''));
  const h = 90 * s;
  if (o.glow) glow(x + len / 2, y, len * .6 + 120 * s, '#FFD58A', o.glow);
  if (len > 10) {
    paint(rectPts(x, y - h / 2, len, h, 2), { wash: PAL.cream, fill: '#EADCC0', fillOp: 80, tex: .5, ink: PAL.ink, sw: clamp(s, .5, 1.2) });
    for (let r = 0; r < 3; r++) inkLine([[x + 12, y - h / 2 + 22 * s + r * 22 * s], [x + len - 12, y - h / 2 + 22 * s + r * 22 * s]], .5, '#B5A58A', 'inkfine', 0);
    const n = Math.floor(len / (46 * s));
    for (let i = 0; i < n; i++) { const nx = x + 30 * s + i * 46 * s, ny = y - h / 2 + (22 + 22 * Math.floor(hash(i + 3) * 3)) * s + 8 * s; paint(ellPts(nx, ny, 7 * s, 5 * s, 8), { wash: [PAL.clay, HI.teal, PAL.ochre, PAL.violet][i % 4], ink: PAL.ink, sw: .5 }); inkLine([[nx + 6 * s, ny], [nx + 6 * s, ny - 22 * s]], .8, PAL.ink, 'inkfine', 0); }
  }
  for (const rx of [x, x + len]) paint(rrPts(rx - 9 * s, y - h / 2 - 16 * s, 18 * s, h + 32 * s, 8 * s), { wash: '#B07A52', fill: '#8A5A3C', fillOp: 60, ink: PAL.ink, sw: clamp(s, .5, 1.2) });
}
// the gifts swirling together: four coloured ribbons spiralling in to (cx, cy); k 0..1 tightens them
function swirl(cx, cy, r, k, t) {
  const cols = [PAL.clay, HI.teal, PAL.ochre, PAL.violet];
  for (let j = 0; j < 4; j++) {
    boilSeed('swirl' + j);
    const P = []; for (let i = 0; i <= 16; i++) { const f = i / 16, a = t * 3 + j * TAU / 4 + f * 4, rr = r * (1 - k * .8) * (1 - f * .85); P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]); }
    inkLine(P, 5 + 3 * k, cols[j], 'ink', .8);
  }
}
