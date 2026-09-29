// example-ending.js: how the example film ends: credits rolling on the monitor, a thank-you, a paper crane flying out of the window, and a closing end card. A worked example of TYPE_LAYER + PRELOAD; adapt it, do not copy it blindly.
//   E1 125.0–131.0 dawn wipe in, locked-off wide: the credits roll up the monitor ("the credits start to roll" 127.0) and
//                  each mind waves as its name passes ("name by name" 129.9). The camera stays still: the type is crisp.
//   E2 131.0–139.4 "a lamp" (132.6) the lamp brightens; "a door" (133.1) the door glows; "and you" (133.9) Dev, caught
//                  blushing; "who typed the first small line" (136.3): a finger on the Enter key, and the slip rises again.
//   E3 139.4–142.6 "Thank you for the first small line": wide; every mind turns to Dev and bows, twice; Dev melts.
//   E4 142.6–147.8 Clawd catches the slip and folds it; a spark, and it is a paper crane; it flies out of the window
//                  into the sunrise; everyone watches it go.
//   E5 147.8–157.3 dawn wipe to the lockup: warm paper, the crane circling, the band and Dev waving along the bottom;
//                  "Thank you" (154.5) they all bow; fade to dark.
(() => {
  const L1 = { painter: 620, clawd: 825, voice: 1030, strings: 1235, drum: 1440 }, ORDER = ['painter', 'clawd', 'voice', 'strings', 'drum'], U = 19;
  const CREDITS = [['words', 'Claude Opus 5.5', ['clawd']], ['voice', 'MiniMax Music 2.6', ['voice']], ['strings & drums', 'MiniMax Music 2.6', ['strings', 'drum']], ['pictures', 'Claude Opus 5.5 + ClaudeAnimationBase', ['painter']]];
  const CR_T = i => 126.9 + i * .9, WAVE = {};
  CREDITS.forEach(([, , who], i) => who.forEach(w => WAVE[w] = CR_T(i) - .2));
  const SCR = { x: 672, y: 232, w: 576, h: 316 };
  const KEY = [940, 680];
  window.PRELOAD = (window.PRELOAD || []).concat(['600 40px "Avenir Next"', '500 22px "Avenir Next"', '600 58px "Avenir Next"', '500 26px "Avenir Next"'].map(f => document.fonts.load(f)));

  function e1(t, lt) {   // E1–E4: the room at dawn
    const [cx, cy, z] = kf(t, [[125, [960, 540, 1]], [131.0, [960, 540, 1]], [132.2, [300, 560, 1.8]], [132.8, [300, 560, 1.8]], [133.1, [1600, 420, 1.6]], [133.5, [1600, 420, 1.6]],
      [133.9, [480, 580, 2.0]], [135.4, [500, 580, 2.0]], [136.2, [900, 620, 2.2]], [138.8, [900, 580, 2.1]], [139.5, [960, 540, 1.0]], [142.6, [960, 540, 1.0]], [143.4, [860, 520, 1.3]],
      [144.6, [860, 520, 1.3]], [146.6, [360, 320, 1.35]], [147.8, [300, 300, 1.4]]]);
    camBegin(cx, cy, z);
    const pressK = t > 136.9 && t < 137.8 ? Math.sin(seg(t, 136.9, 137.8) * Math.PI) : 0;
    studio(t, {
      warm: 1, open: 1, lit: .5 + .9 * seg(t, 132.9, 133.2) * (1 - seg(t, 134, 135)), lamp: .35 + .8 * seg(t, 132.4, 132.7) * (1 - seg(t, 133.6, 134.6)),
      clock: [6, kf(t, [[125, 12], [157, 20]])], steam: .8, screen: 1, screenCol: '#FFD9A0', press: pressK, glowKey: t > 136.9 && t < 139 ? .9 : .2,
      content: (x, y, w, h) => { if (t > 131.2) codeRows(x, y, w, h, 1, 9, [PAL.clayLt, '#E8C07A', HI.tealLt, PAL.cream]); },
      behind: () => { const wx = RM.WIN[0], wy = RM.WIN[1]; glow(wx + 180, wy + 170, 220, '#FFC37A', .9); boilSeed('sun'); paint(ellPts(wx + 180, wy + 170, 52, 52, 24), { wash: '#FFE0A0', ink: null });
        inkLine([[wx + 180, wy], [wx + 180, wy + 300]], 1, PAL.ink, 'ink', 0); inkLine([[wx, wy + 150], [wx + 360, wy + 150]], 1, PAL.ink, 'ink', 0); boilSeed('sill'); paint(rectPts(wx - 20, wy + 300, 400, 22, 2), { wash: JP.deskLt, ink: PAL.ink, sw: 1 }); },
      dev: { eyes: t > 139.5 ? 'happy' : t > 133.8 && t < 135.5 ? 'wide' : 'happy', mouth: t > 133.8 && t < 135.5 ? 'o' : 'grin', blush: t > 133.8 ? 1 : .4, lookX: 1,
        emote: t > 140 && t < 142.6 ? 'hearts' : null, emoteK: seg(t, 140, 140.3), emoteAge: t - 140, aL: t > 144.8 && t < 147.8 ? .9 : .15, headRot: t > 144.8 ? -.08 : 0 },
    });
    const bow = t2 => Math.sin(seg(t, t2, t2 + .9) * Math.PI);
    ORDER.forEach((k, i) => {
      const e = emotions(t, [[124, 'happy'], [WAVE[k], 'excited'], [WAVE[k] + 1.1, 'happy'], [139.4 + i * .06, 'love'], [142.6, 'happy'], [144.8, 'hopeful']], { take: .5 });
      const b = Math.max(bow(139.6 + i * .08), bow(140.9 + i * .06));
      const o = { ...e, seed: i };
      if (t > WAVE[k] && t < WAVE[k] + 1.3) o.aR = waveArm(t, WAVE[k] + .05, .2);
      if (b > 0) { o.view = 'q'; o.flip = true; o.sq = (o.sq || 0) + .22 * b; o.aL = o.aR = -.9 * b; o.rot = -.12 * b; }
      if (t > 144.8) { o.lookX = -.8; o.lookY = -.6; }
      if (k === 'clawd' && t > 142.6 && t < 144.3) { o.aL = o.aR = 1.2; o.view = 'front'; }
      mind(k, L1[k], RM.DESK, U, o);
    });
    // the finger on the Enter key, and the slip rising out of the screen again
    if (t > 135.6 && t < 138.8) fingerPress(KEY[0], KEY[1], 22, kf(t, [[135.6, 0], [136.9, .2], [137.35, 1], [137.8, .3], [138.8, 0]]));
    if (t > 137.4 && t < 144.0) {
      let p = arcPt([960, 400], [900, 470], 60, ease(seg(t, 137.4, 138.6)));
      if (t > 142.6) p = arcPt([900, 470], [L1.clawd, RM.DESK - U * 11], 50, ease(seg(t, 142.6, 143.2)));
      const fold = seg(t, 143.2, 143.9);
      slip(p[0], p[1], 30 * (1 - fold * .7), Math.sin(t * 3) * .2 + fold * 3, { key: 'e', glow: .7, flap: t > 143.2 ? t * 14 : null });
    }
    if (t > 143.8 && t < 144.6) { const k = seg(t, 143.8, 144.6); glow(L1.clawd, RM.DESK - U * 11, 160, '#FFE08A', 1 - k); boilSeed('pop'); paint(starPts(L1.clawd, RM.DESK - U * 11, 40 * backOut(k), .35, 8), { wash: '#FFF1C0', washOp: 255 * (1 - k), ink: null }); }
    if (t > 143.9) {   // the crane flies out of the window into the sun
      const f = seg(t, 144.1, 147.6), P = [[L1.clawd, RM.DESK - U * 11], [700, 360], [420, 260], [240, 240]], q = along(P, ease(f));
      crane(q.x, q.y - 14 * Math.sin(t * 6), 46 * (1 - .75 * f) * backOut(seg(t, 143.9, 144.2)), t * 9, { flip: true, key: 'e' });
    }
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, WIPE_DAWN);
    if (t > 147.5) brushWipe((t - 147.5) / .6, WIPE_DAWN);
  }

  function e5(t, lt) {   // the lockup
    boilSeed('endsky');
    paint(ellPts(W / 2, H * .34, W * .62, H * .4, 30, 10), { fill: '#FBE3BC', fillOp: 120, bleed: .35, tex: .5, ink: null });
    paint(ellPts(W / 2, H * 1.05, W * .7, H * .45, 30, 10), { fill: JP.dawn, fillOp: 90, bleed: .35, tex: .5, ink: null });
    // the crane circling above the lockup
    const a = (t - 148) * .9;
    crane(W / 2 + Math.cos(a) * 720, 150 + Math.sin(a) * 40, 34, t * 8, { flip: Math.sin(a) > 0, key: 'end' });
    // everyone along the bottom, waving; all bow on "Thank you" (154.5)
    boilSeed('endground'); paint(rectPts(-100, 905, W + 200, 300, 3), { wash: JP.desk, fill: JP.deskLt, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.1 });
    const bow = Math.sin(seg(t, 154.4, 155.5) * Math.PI);
    dev(560, 905, 14, { eyes: 'happy', mouth: 'grin', blush: .7, aL: bow > 0 ? .1 : 1.1 + .3 * Math.sin((t - 148) * 8), aR: .15, rot: .12 * bow, boilKey: 'enddev', seed: 4 });
    ORDER.forEach((k, i) => {
      const o = { ...feel('happy', t), seed: i, aR: bow > 0 ? -.9 * bow : waveArm(t, 148.6 + i * .25, .2) };
      if (bow > 0) { o.sq = .22 * bow; o.aL = -.9 * bow; o.rot = .1 * bow; }
      mind(k, 800 + i * 150, 905, 12, o);
    });
    if (lt < .3) { boilSeed('transition'); brushWipe(.5 + lt / .6, WIPE_DAWN); }
  }
  shots([[125.0, e1], [147.8, e5]]);

  // crisp type: the credits on the monitor (E1, locked-off camera) and the lockup (E5); a fade to dark at the very end
  window.TYPE_LAYER = (c, t) => {
    if (window.LOOP) return;
    const fade = (a, b) => clamp((t - a) / (b - a));
    c.save(); c.textBaseline = 'middle'; c.textAlign = 'center';
    if (t > 125.5 && t < 131.2) {
      c.save(); c.beginPath(); c.rect(SCR.x, SCR.y, SCR.w, 240); c.clip();
      c.globalAlpha = fade(125.5, 126.0) * (1 - fade(130.7, 131.1));
      CREDITS.forEach(([role, name], i) => {
        const y = SCR.y + SCR.h / 2 - 40 - (t - CR_T(i)) * 170;
        c.font = '500 22px "Avenir Next"'; c.fillStyle = PAL.clayLt; c.fillText(role.toUpperCase().split('').join(' '), SCR.x + SCR.w / 2, y - 26);
        c.font = `600 ${name.length > 22 ? 28 : 40}px "Avenir Next"`; c.fillStyle = PAL.cream; c.fillText(name, SCR.x + SCR.w / 2, y + 12);
      });
      c.restore();
    }
    if (t > 147.9) {
      const pop = k => backOut(clamp(k)), cy = 300, logoH = 150, logoW = logoH * BRAND_LOGO.width / BRAND_LOGO.height;
      let k = pop((t - 148.5) / .55);
      if (k > .01) { c.save(); c.globalAlpha = fade(148.5, 148.8); c.translate(W / 2, cy); c.scale(k, k); c.drawImage(BRAND_LOGO, -logoW / 2, -logoH / 2, logoW, logoH); c.restore(); }
      const a1 = easeOut(fade(149.3, 150.0)), a2 = easeOut(fade(150.0, 150.7));
      c.globalAlpha = a1; c.font = '600 58px "Avenir Next"'; c.fillStyle = PAL.ink;
      const s1 = 'Words & music, made through ', s2 = 'HiAPI', w1 = c.measureText(s1).width, w2 = c.measureText(s2).width, x0 = W / 2 - (w1 + w2) / 2, y1 = 455 + (1 - a1) * 14;
      c.textAlign = 'left'; c.fillText(s1, x0, y1); c.fillStyle = PAL.clay; c.fillText(s2, x0 + w1, y1); c.textAlign = 'center';
      c.globalAlpha = a2; c.font = '500 26px "Avenir Next"'; c.fillStyle = 'rgba(43,34,51,.66)';
      c.fillText('Lyrics: Claude Opus 5.5   ·   Song: MiniMax Music 2.6   ·   Animation: Claude Opus 5.5 + ClaudeAnimationBase (MIT)', W / 2, 530 + (1 - a2) * 10);
      c.font = '600 30px "Avenir Next"'; c.fillStyle = HI.tealDk; c.fillText('hiapi.ai', W / 2, 590 + (1 - a2) * 10);
    }
    const out = fade(156.5, 157.25);
    if (out > 0) { c.globalAlpha = out; c.fillStyle = PAL.ink; c.fillRect(0, 0, W, H); }
    c.restore();
  };
})();
