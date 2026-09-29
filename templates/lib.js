// lib.js: the reference film's shared cast and props on top of ClaudeAnimationBase: Dev (the person at the desk), room(), desk(), the Enter key, coins, bugs, ticks, pages, and the wipe colours.

// ---------- palette for this film ----------
const JP = {
  room: '#28305E', roomDk: '#1C2248', wall: '#3B4478', dawn: '#F4C58A', dawnLt: '#FBE3BC',
  desk: '#8A5A3C', deskDk: '#6A4028', deskLt: '#B07A52',
  screen: '#1E3A3A', screenGlow: '#7FE0B0', green: '#6CC98A', greenDk: '#3E8E5A', red: '#E0604F',
  hood: '#5D6FB0', hoodDk: '#3F4E8A', hoodLt: '#8A9AD0', skin: '#F2C29E', skinDk: '#D69A76', hair: '#3A2A2E',
  token: '#E8894F', tokenLt: '#F7B98A', glass: '#CFE6EE', key: '#EDE3D2', keyDk: '#B9AC96'
};

// ---------- Dev ----------
// Dev(x, y, u, o): (x, y) = ground point between the feet, u = size unit (Dev is about 9u wide, 14u tall).
// o: dx, dy (u), sq, rot, flip, eyes ('open' | 'closed' | 'wide' | 'worried' | 'sleepy' | 'happy' | 'shut'),
//    mouth ('smile' | 'o' | 'O' | 'flat' | 'frown' | 'grin' | 'wobble' | null), lookX/lookY (-1..1), aL/aR (arm angles,
//    0 = hanging, 1.5 = straight up, negative = behind), handL/handR(u, sw) hooks at the hand, sweat 0..1, blush 0..1,
//    sit (true: no legs, sitting on something), hood (0..1 pulls the hood up), zzz 0..1, boilKey.
let DEV_N = 0;
function dev(x, y, u, o = {}) {
  const id = o.boilKey ?? ('dev' + (++DEV_N)), rs = p => boilSeed(`dev ${id} ${p}`);
  const sw = clamp(u / 15, .45, 2.2), J = u * .06, sq = o.sq || 0;
  x += (o.dx || 0) * u; const dy = (o.dy || 0) * u;
  const breathe = .04 * Math.sin(T * 2.2 + (o.seed || 0));
  rs('shadow');
  if (!o.noShadow && !o.sit) paint(ellPts(x, y + u * .15, u * 4.6, u * .9, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);
  // legs (jeans) and sneakers
  if (!o.sit) {
    const wk = o.walk;
    [[-1.6, 0], [1.6, .5]].forEach(([lx, ph], i) => {
      rs('leg' + i);
      const sx = wk != null ? Math.sin((wk + ph) * TAU) * .9 : 0, lift = wk != null ? Math.max(0, Math.cos((wk + ph) * TAU)) * .6 : 0;
      paint(rectPts((lx - .9 + sx * .5) * u, -4.2 * u, 1.8 * u, (4 - lift) * u, J), { wash: '#4A5F86', ink: PAL.ink, sw: sw * .8 });
      paint(rrPts((lx - 1.2 + sx) * u, (-.9 - lift) * u, 2.6 * u, 1 * u, .45 * u, J * .5), { wash: PAL.cream, fill: PAL.keyDk, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
    });
  }
  // arms go behind the body when lowered past the back, else in front
  const drawArm = (side, a, hook, key) => {
    rs('arm' + key);
    const px = side * 3.3 * u, py = -9.2 * u, L = 4.6 * u, th = a * Math.PI / 1.5;   // 0 = hanging, .75 = out, 1.5 = up
    const ex = px + side * Math.sin(th) * L, ey = py + Math.cos(th) * L;
    const mx = (px + ex) / 2 + side * .5 * u, my = (py + ey) / 2 + .3 * u;
    paint(ribbon([[px, py], [mx, my], [ex, ey]], 1.9 * u, 1.5 * u), { wash: JP.hood, fill: JP.hoodDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(ex, ey, .95 * u, .95 * u, 14, J * .5), { wash: JP.skin, ink: PAL.ink, sw: sw * .7 });
    if (hook) { push(); translate(ex, ey); hook(u, sw); pop(); }
  };
  const aL = o.aL ?? .15, aR = o.aR ?? .15;
  if (aL < -.2) drawArm(-1, aL, o.handL, 'L');
  if (aR < -.2) drawArm(1, aR, o.handR, 'R');
  // body: a hoodie pear, pocket and drawstrings
  rs('body');
  const top = -11.3 * u * (1 + breathe * .2), body = through([[-3.6 * u, -4 * u], [-4.3 * u, -7.5 * u], [-3.3 * u, top + .6 * u], [0, top], [3.3 * u, top + .6 * u], [4.3 * u, -7.5 * u], [3.6 * u, -4 * u], [0, -3.7 * u], [-3.6 * u, -4 * u]], 4);
  paint(body, { wash: JP.hood, fill: JP.hoodDk, fillOp: 70, bleed: .05, tex: .6, ink: PAL.ink, sw });
  paint(rrPts(-2.2 * u, -6.6 * u, 4.4 * u, 1.9 * u, .6 * u, J), { fill: JP.hoodDk, fillOp: 120, ink: PAL.ink, sw: sw * .5 });
  for (const s of [-1, 1]) inkLine([[s * .8 * u, -10.4 * u], [s * .9 * u + Math.sin(T * 3 + s) * .15 * u, -8.6 * u]], sw * .6, PAL.cream, 'inkfine', .4);
  // hood behind the head
  rs('hood');
  const hood = o.hood || 0;
  paint(ellPts(0, -13.9 * u - hood * .4 * u, 3.9 * u + hood * .3 * u, 3.5 * u + hood * .4 * u, 26, J), { wash: JP.hoodDk, ink: PAL.ink, sw: sw * .8 });
  // arms in front of the body and hood (and behind the head, so raised hands never cover the face)
  if (aL >= -.2) drawArm(-1, aL, o.handL, 'L');
  if (aR >= -.2) drawArm(1, aR, o.handR, 'R');
  // head
  rs('head');
  push(); translate(0, -14 * u + breathe * u); if (o.headRot) rotate(o.headRot);
  paint(ellPts(0, 0, 3.1 * u, 3.3 * u, 28, J), { wash: JP.skin, fill: JP.skinDk, fillOp: 50, tex: .5, ink: PAL.ink, sw });
  // messy hair: a clump of spiky tufts on top
  rs('hair');
  const hair = [[-3.1 * u, -.6 * u]]; for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI, r = (i % 2 ? 3.4 : 4.3 + .4 * hash(i + 3)) * u; hair.push([Math.cos(a) * r * .95, Math.sin(a) * r * .95 - .5 * u]); }
  hair.push([3.1 * u, -.6 * u], [1.5 * u, -1.8 * u], [-1.4 * u, -1.5 * u]);
  paint(hair, { wash: JP.hair, ink: PAL.ink, sw: sw * .8 });
  if (hood > .3) paint(ellPts(0, -1.2 * u, 3.6 * u, 2.4 * u * hood, 20, J, 0).filter(p => p[1] < -.6 * u), { wash: JP.hood, ink: PAL.ink, sw: sw * .8 });
  // glasses + eyes
  rs('face');
  const lx = clamp(o.lookX || 0, -1, 1) * .35 * u, ly = clamp(o.lookY || 0, -1, 1) * .3 * u, e = o.eyes || 'open';
  const blink = (e === 'open' || e === 'wide' || e === 'worried') && frac(T * .31 + (o.seed || 0) * .7) < .035;
  for (const s of [-1, 1]) {
    const cx = s * 1.35 * u, cy = .1 * u;
    paint(ellPts(cx, cy, 1.15 * u, 1.05 * u, 18, J * .4), { wash: '#EAF4F4', washOp: 150, ink: PAL.ink, sw: sw * .8 });
    if (blink || e === 'closed') inkLine([[cx - .6 * u, cy + .1 * u], [cx, cy + .3 * u], [cx + .6 * u, cy + .1 * u]], sw * .8, PAL.ink, 'ink', .6);
    else if (e === 'happy') inkLine([[cx - .6 * u, cy + .25 * u], [cx, cy - .3 * u], [cx + .6 * u, cy + .25 * u]], sw * .8, PAL.ink, 'ink', .6);
    else if (e === 'sleepy') { inkLine([[cx - .65 * u, cy], [cx + .65 * u, cy]], sw * .8, PAL.ink, 'ink', .2); paint(ellPts(cx + lx * .5, cy + .3 * u, .28 * u, .2 * u, 10), { wash: PAL.ink, ink: null }); }
    else if (e === 'shut') inkLine([[cx - .6 * u, cy - .2 * u], [cx + .6 * u, cy + .2 * u]], sw * .8, PAL.ink, 'ink', 0);
    else {
      const r = e === 'wide' ? .5 * u : .34 * u;
      paint(ellPts(cx + lx, cy + ly, r, r * 1.15, 12), { wash: PAL.ink, ink: null });
      paint(ellPts(cx + lx + r * .35, cy + ly - r * .4, r * .3, r * .3, 8), { wash: PAL.cream, ink: null });
      if (e === 'worried') inkLine([[cx - .7 * u, cy - 1.3 * u - s * .25 * u], [cx + .6 * u, cy - 1.3 * u + s * .25 * u]], sw * .8, PAL.ink, 'ink', 0);
    }
  }
  inkLine([[-.25 * u, 0], [.25 * u, 0]], sw * .7, PAL.ink, 'inkfine', 0);
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2 * u, 1.5 * u, .7 * u, .35 * u, 12), { fill: PAL.rose, fillOp: 140 * o.blush, ink: null });
  // mouth
  const m = o.mouth === undefined ? 'smile' : o.mouth, my = 2 * u;
  if (m === 'smile') inkLine([[-.7 * u, my - .1 * u], [0, my + .35 * u], [.7 * u, my - .1 * u]], sw * .8, PAL.ink, 'ink', .6);
  else if (m === 'grin') paint([[-1 * u, my - .2 * u], [1 * u, my - .2 * u], [.5 * u, my + .7 * u], [-.5 * u, my + .7 * u]], { wash: PAL.cream, ink: PAL.ink, sw: sw * .7, curv: .4 });
  else if (m === 'o' || m === 'O') { const r = m === 'O' ? .6 * u : .32 * u; paint(ellPts(0, my + .2 * u, r, r * 1.2, 12), { wash: '#6B2E3A', ink: PAL.ink, sw: sw * .7 }); }
  else if (m === 'flat') inkLine([[-.6 * u, my], [.6 * u, my]], sw * .8, PAL.ink, 'ink', 0);
  else if (m === 'frown') inkLine([[-.7 * u, my + .35 * u], [0, my - .05 * u], [.7 * u, my + .35 * u]], sw * .8, PAL.ink, 'ink', .6);
  else if (m === 'wobble') inkLine([[-.8 * u, my], [-.4 * u, my - .2 * u], [0, my + .1 * u], [.4 * u, my - .2 * u], [.8 * u, my]], sw * .8, PAL.ink, 'ink', .6);
  pop();
  pop();
  // marks by the head
  rs('marks');
  const hx = x + (o.flip ? -1 : 1) * 3.6 * u, hy = y + dy - 16.5 * u;
  if (o.sweat > .02) emote('sweat', hx, hy + 2 * u, u * .9, o.sweat, T);
  if (o.zzz > .02) emote('zzz', hx, hy, u * .9, o.zzz, T);
  if (o.emote) emote(o.emote, hx, hy, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
}

// ---------- the room at night (or at dawn: warm 0..1) ----------
function room(t, warm = 0, o = {}) {
  boilSeed('room');
  const wall = mixCol(JP.room, '#C98A6A', warm * .6);
  paint(rectPts(-800, -600, W + 1600, H + 1200), { wash: wall, ink: null });
  paint(ellPts(W * .5, H * .35, W * .7, H * .5, 30, 8), { fill: mixCol(JP.wall, JP.dawn, warm), fillOp: 90, bleed: .3, tex: .6, ink: null });
  // window, top right: stars at night, a sunrise at dawn
  boilSeed('window');
  const wx = o.wx ?? 1450, wy = o.wy ?? 120, ww = 360, wh = 300;
  paint(rectPts(wx, wy, ww, wh, 2), { wash: mixCol(PAL.night, JP.dawn, warm), ink: PAL.ink, sw: 1.2 });
  if (warm > .05) { glow(wx + ww * .5, wy + wh * .95, 120 + 120 * warm, '#FFC37A', warm); paint(ellPts(wx + ww * .5, wy + wh + 10, 70, 70, 20), { wash: mixCol('#F2A65A', '#FFE0A0', warm), ink: null }); }
  for (let i = 0; i < 9; i++) { const sx = wx + 20 + hash(i + 40) * (ww - 40), sy = wy + 20 + hash(i + 60) * (wh * .6); paint(starPts(sx, sy, (4 + 3 * hash(i)) * (.6 + .4 * Math.sin(t * 2 + i)) * (1 - warm), .35, 4), { wash: PAL.cream, ink: null }); }
  inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 1, PAL.ink, 'ink', 0);
  inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 1, PAL.ink, 'ink', 0);
  paint(rectPts(wx - 20, wy + wh, ww + 40, 22, 2), { wash: JP.deskLt, ink: PAL.ink, sw: 1 });
  // floor
  boilSeed('floor');
  paint(rectPts(-800, 880, W + 1600, 700, 3), { wash: mixCol('#3A3358', '#B07A60', warm * .7), fill: mixCol(JP.roomDk, JP.deskDk, warm), fillOp: 80, tex: .6, ink: null });
  inkLine([[-400, 880], [W / 2, 876], [W + 400, 882]], 1, PAL.ink, 'ink', .5);
}

// ---------- desk, monitor, keyboard ----------
// desk(o): o.x (centre), o.y (desk top), o.screen 0..1 brightness, o.screenCol, o.content(sx, sy, sw, sh) paints on the screen.
function desk(t, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 700, glowK = o.screen ?? 1, sc = o.screenCol || JP.screenGlow;
  // monitor
  boilSeed('monitor');
  const mw = 620, mh = 380, mx = x - mw / 2 + (o.monDx || 0), my = y - mh - 110;
  if (glowK > .02) glow(mx + mw / 2, my + mh / 2, 520, sc, .45 * glowK);
  paint(rectPts(mx + mw / 2 - 30, my + mh, 60, 100, 2), { wash: '#5A5A6E', ink: PAL.ink, sw: 1 });
  paint(ellPts(mx + mw / 2, y - 6, 120, 16, 18), { wash: '#5A5A6E', ink: PAL.ink, sw: 1 });
  paint(rrPts(mx, my, mw, mh, 22, 2), { wash: '#3E3E52', ink: PAL.ink, sw: 1.4 });
  paint(rrPts(mx + 22, my + 22, mw - 44, mh - 44, 10, 1.5), { wash: mixCol('#141A24', JP.screen, glowK), fill: sc, fillOp: 40 * glowK, bleed: .1, tex: .4, ink: PAL.ink, sw: .8 });
  if (o.content) { boilSeed('screen'); o.content(mx + 22, my + 22, mw - 44, mh - 44); }
  // desk top
  boilSeed('desk');
  paint(rectPts(x - 900, y, 1800, 60, 2), { wash: JP.desk, fill: JP.deskLt, fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.3 });
  paint(rectPts(x - 860, y + 60, 60, 400, 2), { wash: JP.deskDk, ink: PAL.ink, sw: 1.1 });
  paint(rectPts(x + 800, y + 60, 60, 400, 2), { wash: JP.deskDk, ink: PAL.ink, sw: 1.1 });
  // keyboard with the big Enter key at its right end
  if (!o.noKeyboard) {
    boilSeed('keyboard');
    const kx = x - 250 + (o.kbDx || 0), ky = y - 34;
    paint(rrPts(kx, ky, 420, 44, 10, 1.5), { wash: '#4A4A5E', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 9; i++) paint(rrPts(kx + 14 + i * 34, ky + 8, 26, 22, 5), { wash: JP.key, ink: PAL.ink, sw: .5 });
    enterKey(kx + 380, ky + 14, 36, o.press || 0, o.enterGlow || 0);
  }
}

// The Enter key: a chunky keycap with a painted return arrow. (x, y) = centre of its top, s = size, press 0..1 sinks it,
// lit 0..1 makes it glow orange (the "one more prompt" motif).
function enterKey(x, y, s, press = 0, lit = 0) {
  boilSeed('enter' + Math.round(x) + Math.round(y));
  const d = s * .28 * press, sw = clamp(s / 60, .5, 2.2);
  if (lit > .02) glow(x, y + d, s * 2.6, '#FFB070', lit);
  paint(rrPts(x - s, y - s * .55 + s * .35, s * 2, s * 1.1, s * .22), { wash: JP.keyDk, ink: PAL.ink, sw });
  paint(rrPts(x - s * .92, y - s * .55 + d, s * 1.84, s * 1.0, s * .2), { wash: mixCol(JP.key, JP.tokenLt, lit * .7), fill: JP.keyDk, fillOp: 40, tex: .5, ink: PAL.ink, sw });
  const ax = x + s * .45, ay = y - s * .3 + d;
  inkLine([[ax, ay - s * .1], [ax, ay + s * .25], [x - s * .45, ay + s * .25]], sw * 1.1, PAL.ink, 'ink', 0);
  inkLine([[x - s * .25, ay + s * .08], [x - s * .47, ay + s * .25], [x - s * .25, ay + s * .42]], sw * 1.1, PAL.ink, 'ink', 0);
}

// A finger (Dev's, from above) pressing down at (x, y); press 0..1 = how far it has come down.
function fingerPress(x, y, s, press) {
  boilSeed('finger');
  const top = y - s * 4 + press * s * 2.6;
  paint(ribbon([[x + s * .3, top - s * 6], [x, top - s * 2], [x, top]], s * 1.25, s * 1.05), { wash: JP.skin, fill: JP.skinDk, fillOp: 50, ink: PAL.ink, sw: clamp(s / 50, .5, 2) });
  paint(ellPts(x, top - s * .2, s * .35, s * .22, 10), { wash: '#F7D8C4', ink: PAL.ink, sw: clamp(s / 90, .3, 1) });
  paint(ribbon([[x + s * .4, top - s * 9], [x + s * .3, top - s * 5.2]], s * 2.2, s * 1.6), { wash: JP.hood, ink: PAL.ink, sw: clamp(s / 50, .5, 2) });
}

// ---------- tokens ----------
// A token: an orange coin with a painted spark (the burst). r = radius; spin 0..1 squashes it edge-on.
function coin(x, y, r, spin = 0, key = '') {
  boilSeed('coin' + key);
  const sx = Math.max(.12, Math.abs(Math.cos(spin * Math.PI)));
  paint(ellPts(x, y, r * sx, r, 18, r * .03), { wash: JP.token, fill: JP.tokenLt, fillOp: 90, tex: .5, ink: PAL.ink, sw: clamp(r / 30, .35, 1.2) });
  if (sx > .45) for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; inkLine([[x - Math.cos(a) * r * .55 * sx, y - Math.sin(a) * r * .55], [x + Math.cos(a) * r * .55 * sx, y + Math.sin(a) * r * .55]], clamp(r / 26, .35, 1.2), PAL.cream, 'inkfine', 0); }
}
// The token jar: the recurring gauge. level 0..1 fills it with coins; t drives the shimmer. (x, y) = bottom centre, s = scale.
// o.lid 0..1 closes a lid on top (rate limit), o.over 0..1 heaps coins above the rim.
function tokenJar(x, y, s, level, t, o = {}) {
  boilSeed('jar');
  const w = 120 * s, h = 200 * s, sw = clamp(s, .6, 1.6);
  const L = clamp(level);
  if (L > .05) glow(x, y - h * L * .5, 120 * s + 120 * s * L, '#FFB070', .5 * L);
  paint(rrPts(x - w / 2, y - h, w, h, 24 * s, 1.5), { wash: JP.glass, washOp: 90, ink: null });
  // coins stacked inside, painted bottom up
  // coins lie flat in the jar: a heap of edge-on discs, two columns, bottom up
  const n = Math.round(L * 22);
  for (let i = 0; i < n; i++) {
    boilSeed('jc' + i);
    const row = Math.floor(i / 2), cx = x + (i % 2 ? 20 : -20) * s + (hash(i) - .5) * 16 * s, cy = y - 12 * s - row * 16 * s;
    paint(ellPts(cx, cy, 28 * s, 9 * s, 16), { wash: i % 3 ? JP.token : JP.tokenLt, fill: PAL.clayDk, fillOp: 50, ink: PAL.ink, sw: sw * .5 });
  }
  if (o.over > .02) for (let i = 0; i < 6; i++) { const a = backOut(clamp(o.over * 1.4 - i * .08)); coin(x + (i - 2.5) * 22 * s, y - h - 10 * s - (i % 2) * 16 * s * a, 18 * s * a, .3, 'o' + i); }
  boilSeed('jarglass');
  paint(rrPts(x - w / 2, y - h, w, h, 24 * s, 1.5), { ink: PAL.ink, sw });
  inkLine([[x - w * .32, y - h * .8], [x - w * .32, y - h * .35]], sw * 1.2, PAL.cream, 'inkfine', 0);
  paint(rrPts(x - w * .55, y - h - 12 * s, w * 1.1, 18 * s, 6 * s), { wash: JP.glass, washOp: 140, ink: PAL.ink, sw: sw * .8 });
  if (o.lid > .02) { const k = backOut(o.lid); paint(rrPts(x - w * .6, y - h - 30 * s - (1 - k) * 200 * s, w * 1.2, 26 * s, 8 * s), { wash: JP.red, ink: PAL.ink, sw }); }
}

// ---------- small props ----------
// A painted checkmark; k 0..1 draws it on.
function tick(x, y, s, k = 1, col = JP.green) {
  if (k <= 0) return;
  boilSeed('tick' + Math.round(x) + Math.round(y));
  const P = [[x - s * .5, y], [x - s * .15, y + s * .38], [x + s * .6, y - s * .5]];
  const a = clamp(k * 2), b = clamp(k * 2 - 1);
  const pts = [P[0], [lerp(P[0][0], P[1][0], a), lerp(P[0][1], P[1][1], a)]];
  if (b > 0) pts.push([lerp(P[1][0], P[2][0], b), lerp(P[1][1], P[2][1], b)]);
  inkLine(pts, clamp(s / 20, .8, 4), col, 'ink', 0);
}
// A painted cross (a failing test / a bug).
function crossMark(x, y, s, k = 1, col = JP.red) {
  if (k <= 0) return;
  boilSeed('cross' + Math.round(x) + Math.round(y));
  inkLine([[x - s * .45, y - s * .45], [x - s * .45 + s * .9 * clamp(k * 2), y - s * .45 + s * .9 * clamp(k * 2)]], clamp(s / 20, .8, 4), col, 'ink', 0);
  if (k > .5) inkLine([[x + s * .45, y - s * .45], [x + s * .45 - s * .9 * clamp(k * 2 - 1), y - s * .45 + s * .9 * clamp(k * 2 - 1)]], clamp(s / 20, .8, 4), col, 'ink', 0);
}
// A little bug: a round beetle with six scuttling legs and antennae. t drives the scuttle; seed varies it.
function bug(x, y, s, t, seed = 0, o = {}) {
  boilSeed('bug' + seed);
  const sc = Math.sin(t * 22 + seed * 3) * .25, sw = clamp(s / 30, .4, 1.2);
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1);
  for (let i = 0; i < 3; i++) for (const d of [-1, 1]) { const lx = (i - 1) * s * .45; inkLine([[lx, 0], [lx + d * .1 * s + (i % 2 ? sc : -sc) * s * .3, d * s * .55], [lx + d * .2 * s, d * s * .7]], sw, PAL.ink, 'inkfine', .3); }
  paint(ellPts(0, 0, s * .8, s * .55, 18), { wash: o.col || JP.red, fill: '#9A3A30', fillOp: 70, ink: PAL.ink, sw });
  inkLine([[-s * .75, 0], [s * .55, 0]], sw * .7, PAL.ink, 'inkfine', 0);
  paint(ellPts(s * .8, 0, s * .3, s * .28, 12), { wash: PAL.ink, ink: null });
  for (const d of [-1, 1]) inkLine([[s * .95, d * s * .1], [s * 1.3, d * s * .4 + sc * s * .2]], sw * .7, PAL.ink, 'inkfine', .5);
  pop();
}
// Rows of code on a screen or a page: bars of colour, no letters. k 0..1 reveals rows; cols = palette of bar colours.
function codeRows(x, y, w, h, k = 1, seed = 0, cols = [JP.screenGlow, '#E8C07A', '#B7A6F0', PAL.cream]) {
  const rows = Math.floor(h / 26), shown = Math.floor(rows * clamp(k));
  for (let r = 0; r < shown; r++) {
    let cx = x + 12 + (hash(r * 7 + seed) < .5 ? 0 : 28) + (hash(r * 13 + seed) < .25 ? 28 : 0);
    const parts = 1 + Math.floor(hash(r * 3 + seed) * 3);
    for (let p = 0; p < parts && cx < x + w - 30; p++) {
      const bw = Math.min(40 + hash(r * 11 + p + seed) * 140, x + w - 20 - cx);
      inkLine([[cx, y + 16 + r * 26], [cx + bw, y + 16 + r * 26]], 1.6, cols[Math.floor(hash(r * 5 + p + seed) * cols.length)], 'inkfine', 0);
      cx += bw + 16;
    }
  }
}
// A sheet of paper with code rows (docs, a to-do list, a diff). diff: true paints green/red rows.
function page(x, y, w, h, o = {}) {
  boilSeed('page' + (o.key || Math.round(x)));
  push(); translate(x + w / 2, y + h / 2); if (o.rot) rotate(o.rot); translate(-w / 2, -h / 2);
  paint(rectPts(0, 0, w, h, 2), { wash: PAL.cream, fill: PAL.paper, fillOp: 80, tex: .5, ink: PAL.ink, sw: .9 });
  const rows = Math.floor((h - 20) / 22);
  for (let r = 0; r < rows; r++) {
    const bw = (w - 40) * (.4 + .6 * hash(r * 3 + (o.seed || 0)));
    if (o.diff) { const g = hash(r * 7 + (o.seed || 0)) < .5; paint(rectPts(6, 12 + r * 22, w - 12, 18), { wash: g ? '#CDEBCB' : '#F3C9C2', ink: null }); }
    if (o.check) { paint(rectPts(14, 12 + r * 22, 14, 14), { wash: PAL.cream, ink: PAL.ink, sw: .5 }); }
    inkLine([[o.check ? 38 : 16, 20 + r * 22], [16 + bw, 20 + r * 22]], 1.2, o.diff ? PAL.ink : '#7A6E80', 'inkfine', 0);
  }
  pop();
}

// ---------- the shared transitions of this film ----------
const WIPE_NIGHT = [JP.hoodDk, JP.room];
const WIPE_CLAY = [PAL.clayDk, PAL.clay];
const WIPE_GREEN = [JP.greenDk, JP.green];
const WIPE_TOKEN = [PAL.clayDk, JP.token];
