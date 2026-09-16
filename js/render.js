// ===================== render.js =====================
// Pseudo-3D renderer: perspective-projected neon track, layered underwater
// scenery, the animated turtle (seen from behind), and all effects.

const Renderer = (() => {
  const CAM_BACK = 3.2;
  const FAR = 92;
  const Z_NEAR = -2.1;
  const SEG = 2;
  const TURTLE_Z = 0.15;
  const TURTLE_SCALE = 0.82;
  const FOG = [24, 104, 170];

  const TILE = {
    sideA: [20, 82, 114], sideB: [14, 64, 96],
    centerA: [92, 60, 168], centerB: [70, 44, 138],
    sheen: [190, 245, 255], pink: [255, 150, 235], green: [90, 255, 170],
    base: [5, 20, 44], post: [60, 110, 140], pillar: [8, 34, 62]
  };

  const DECOR = [
    { name: "anemoneOrange", w: 1.7 }, { name: "anemonePink", w: 1.6 },
    { name: "tubeCoral", w: 1.35 }, { name: "kelp", w: 1.25 },
    { name: "fanCoral", w: 1.8 }, { name: "rock", w: 2.5 }
  ];

  let ctx = null;
  let W = 0, H = 0, dpr = 1, basis = 0;
  const cam = { cx: 0, horizonY: 0, k0: 1, F: 1, camH: 3, camX: 0, camY: 0, sway: 0 };
  let bgCanvas = null, vignetteCanvas = null;
  let reducedMotion = false;
  let time = 0;
  let particles = [], texts = [], streaks = [], bubbles3d = [], jellies = [], schools = [];
  let shakeT = 0, shakeMag = 0, flashT = 0, flashDur = 1, flashRGB = "255,60,60";

  // --------------------------------------------------------------- Helpers
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

  function project(x, y, z) {
    const dz = z + CAM_BACK;
    const s = cam.F / dz;
    return { x: cam.cx + (x - cam.camX) * s, y: cam.horizonY + cam.sway + (cam.camH + cam.camY - y) * s, s };
  }

  function fogT(z) { return Math.pow(clamp01(z / FAR), 0.75); }

  const fogCache = new Map();
  function fogged(rgb, t, alpha = 1) {
    const q = Math.round(clamp01(t) * 40);
    const key = rgb[0] * 65536 + rgb[1] * 256 + rgb[2] + "|" + q + "|" + alpha;
    let v = fogCache.get(key);
    if (!v) {
      const f = (q / 40) * 0.9;
      v = `rgba(${Math.round(rgb[0] + (FOG[0] - rgb[0]) * f)},${Math.round(rgb[1] + (FOG[1] - rgb[1]) * f)},${Math.round(rgb[2] + (FOG[2] - rgb[2]) * f)},${alpha})`;
      fogCache.set(key, v);
    }
    return v;
  }

  function quad(a, b, c, d) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
    ctx.closePath();
  }

  // ---------------------------------------------------------------- Setup
  function init(context) {
    ctx = context;
    reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    streaks = Array.from({ length: reducedMotion ? 20 : 60 }, () => newStreak(Math.random() * FAR));
    bubbles3d = Array.from({ length: reducedMotion ? 12 : 36 }, () => newBubble(Math.random() * FAR));
    jellies = [
      { fx: 0.16, fy: 0.3, size: 1, hue: "255,120,220", phase: 0, drift: 0.004 },
      { fx: 0.74, fy: 0.18, size: 0.8, hue: "180,140,255", phase: 2, drift: -0.003 },
      { fx: 0.9, fy: 0.42, size: 0.6, hue: "120,230,255", phase: 4, drift: 0.002 }
    ];
    schools = [
      { fx: 0.2, fy: 0.12, dir: 1, speed: 0.012, count: 7 },
      { fx: 0.7, fy: 0.27, dir: -1, speed: 0.009, count: 5 }
    ];
  }

  function newStreak(z) {
    let x, y;
    do { x = (Math.random() * 2 - 1) * 7; y = -1.5 + Math.random() * 6; } while (Math.abs(x) < 1.9 && y < 1.2);
    return { x, y, z };
  }

  function newBubble(z) {
    return { x: (Math.random() * 2 - 1) * 6, y: -1.5 + Math.random() * 5, z, r: 0.03 + Math.random() * 0.06, wob: Math.random() * 6 };
  }

  function resize(w, h, pixelRatio) {
    W = w; H = h; dpr = pixelRatio;
    const portrait = h > w;
    basis = Math.min(w, h * 0.9);
    cam.cx = w / 2;
    cam.horizonY = h * (portrait ? 0.37 : 0.33);
    const trackNearY = h * (portrait ? 0.82 : 0.84);
    cam.k0 = (basis * 0.47) / 1.5;
    cam.F = cam.k0 * CAM_BACK;
    cam.camH = (trackNearY - cam.horizonY) / cam.k0;
    buildBackground();
    buildVignette();
  }

  // ---------------------------------------------------------- Background --
  function buildBackground() {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(W * dpr));
    c.height = Math.max(1, Math.round(H * dpr));
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    const hy = cam.horizonY;
    // H can be 0 before layout settles (hidden iframe, preview pane), which
    // would make every gradient stop NaN and throw out of init().
    const hf = H > 0 ? hy / H : 0.35;

    const water = g.createLinearGradient(0, 0, 0, H);
    water.addColorStop(0, "#3fc1f2");
    water.addColorStop(hf * 0.55, "#1586cc");
    water.addColorStop(hf, "#0e5fa6");
    water.addColorStop(Math.min(0.99, hf + 0.2), "#08386e");
    water.addColorStop(1, "#02132e");
    g.fillStyle = water;
    g.fillRect(0, 0, W, H);

    const sun = g.createRadialGradient(W / 2, -H * 0.08, 0, W / 2, -H * 0.08, Math.max(W, H) * 0.7);
    sun.addColorStop(0, "rgba(230,252,255,0.75)");
    sun.addColorStop(0.35, "rgba(160,230,255,0.25)");
    sun.addColorStop(1, "rgba(160,230,255,0)");
    g.fillStyle = sun;
    g.fillRect(0, 0, W, H);

    // distant ridges
    [[0.16, "rgba(18,96,160,0.55)", 1.3], [0.06, "rgba(12,74,132,0.75)", 2.1]].forEach(([amp, col, freq], k) => {
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(0, hy + 4);
      for (let x = 0; x <= W; x += 12) {
        const n = Math.sin(x / W * Math.PI * freq * 3 + k) * 0.5 + Math.sin(x / W * Math.PI * 9 + k * 2) * 0.2;
        g.lineTo(x, hy - basis * amp * (0.55 + n * 0.45) * (Math.abs(x - W / 2) / (W / 2) + 0.25));
      }
      g.lineTo(W, hy + 4);
      g.closePath();
      g.fill();
    });

    // volcano behind the city
    const vg = g.createLinearGradient(0, hy - basis * 0.5, 0, hy);
    vg.addColorStop(0, "rgba(40,120,180,0.9)");
    vg.addColorStop(1, "rgba(14,80,140,0.9)");
    g.fillStyle = vg;
    g.beginPath();
    g.moveTo(W / 2 - basis * 0.85, hy + 2);
    g.quadraticCurveTo(W / 2 - basis * 0.3, hy - basis * 0.3, W / 2 - basis * 0.12, hy - basis * 0.46);
    g.lineTo(W / 2 + basis * 0.08, hy - basis * 0.47);
    g.quadraticCurveTo(W / 2 + basis * 0.3, hy - basis * 0.3, W / 2 + basis * 0.9, hy + 2);
    g.closePath();
    g.fill();

    drawDomeCity(g, W / 2, hy + 2, basis);
    const wreck = H > W ? 0.4 : 0.55;
    drawShipwreck(g, W * 0.06, hy + (H - hy) * 0.02, basis * wreck, 1);
    drawShipwreck(g, W * 0.95, hy - (H - hy) * 0.01, basis * wreck * 0.9, -1);

    const bed = g.createLinearGradient(0, hy, 0, H);
    bed.addColorStop(0, "rgba(10,70,120,0)");
    bed.addColorStop(0.35, "rgba(6,46,88,0.55)");
    bed.addColorStop(1, "rgba(2,16,36,0.95)");
    g.fillStyle = bed;
    g.fillRect(0, hy, W, H - hy);

    drawPipe(g, 1);
    drawPipe(g, -1);
    bgCanvas = c;
  }

  function drawDomeCity(g, x, y, b) {
    const r = b * 0.3;
    const glowG = g.createRadialGradient(x, y - r * 0.3, 0, x, y - r * 0.3, r * 1.8);
    glowG.addColorStop(0, "rgba(170,250,255,0.55)");
    glowG.addColorStop(1, "rgba(170,250,255,0)");
    g.fillStyle = glowG;
    g.fillRect(x - r * 2, y - r * 2.2, r * 4, r * 2.4);

    const towers = [[-0.66, 0.3, 0.1], [-0.48, 0.5, 0.09], [-0.3, 0.74, 0.1], [-0.12, 0.58, 0.08],
      [0.04, 0.92, 0.12], [0.22, 0.66, 0.09], [0.4, 0.46, 0.09], [0.6, 0.3, 0.09]];
    towers.forEach(([dx, hh, ww]) => {
      const tx = x + dx * r, th = hh * r, tw = ww * r;
      const tg = g.createLinearGradient(0, y - th, 0, y);
      tg.addColorStop(0, "rgba(200,245,255,0.8)");
      tg.addColorStop(1, "rgba(90,170,225,0.45)");
      g.fillStyle = tg;
      g.fillRect(tx - tw / 2, y - th, tw, th);
      g.beginPath(); g.arc(tx, y - th, tw / 2, Math.PI, 0); g.fill();
      g.strokeStyle = "rgba(220,250,255,0.7)";
      g.lineWidth = Math.max(1, b * 0.003);
      g.beginPath(); g.moveTo(tx, y - th - tw / 2); g.lineTo(tx, y - th - tw * 1.4); g.stroke();
      g.fillStyle = "rgba(255,244,190,0.85)";
      for (let wy = y - th + tw * 0.6; wy < y - tw * 0.3; wy += tw * 0.55) {
        g.fillRect(tx - tw * 0.22, wy, tw * 0.14, tw * 0.18);
        g.fillRect(tx + tw * 0.08, wy, tw * 0.14, tw * 0.18);
      }
    });

    g.fillStyle = "rgba(160,240,255,0.14)";
    g.beginPath(); g.ellipse(x, y, r, r * 1.02, 0, Math.PI, 0); g.fill();
    g.strokeStyle = "rgba(200,250,255,0.7)";
    g.lineWidth = Math.max(1.5, b * 0.005);
    g.stroke();
    g.strokeStyle = "rgba(200,250,255,0.18)";
    [0.33, 0.66].forEach(f => { g.beginPath(); g.ellipse(x, y, r * f, r * 1.02, 0, Math.PI, 0); g.stroke(); });
    g.strokeStyle = "rgba(255,255,255,0.45)";
    g.lineWidth = Math.max(2, b * 0.008);
    g.beginPath(); g.ellipse(x, y, r * 0.86, r * 0.88, 0, Math.PI * 1.15, Math.PI * 1.4); g.stroke();
  }

  function drawShipwreck(g, x, y, s, dir) {
    g.save();
    g.translate(x, y);
    g.scale(dir, 1);
    g.rotate(-0.1);
    const hull = g.createLinearGradient(0, -s * 0.2, 0, s * 0.12);
    hull.addColorStop(0, "#2a5878");
    hull.addColorStop(1, "#0b2440");
    g.fillStyle = hull;
    g.beginPath();
    g.moveTo(-s * 0.5, -s * 0.12);
    g.lineTo(s * 0.46, -s * 0.2);
    g.quadraticCurveTo(s * 0.44, s * 0.05, s * 0.3, s * 0.12);
    g.lineTo(-s * 0.36, s * 0.12);
    g.quadraticCurveTo(-s * 0.48, s * 0.02, -s * 0.5, -s * 0.12);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(140,200,230,0.18)";
    g.lineWidth = Math.max(1, s * 0.008);
    for (let i = 1; i < 4; i++) {
      g.beginPath(); g.moveTo(-s * 0.46, -s * 0.12 + i * s * 0.06); g.lineTo(s * 0.42, -s * 0.2 + i * s * 0.07); g.stroke();
    }
    g.fillStyle = "#08192c";
    g.beginPath(); g.ellipse(s * 0.05, -s * 0.02, s * 0.07, s * 0.05, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#1f4a68";
    g.fillRect(-s * 0.38, -s * 0.3, s * 0.26, s * 0.18);
    g.strokeStyle = "#173a56";
    g.lineWidth = s * 0.03;
    g.beginPath(); g.moveTo(-s * 0.02, -s * 0.15); g.lineTo(s * 0.14, -s * 0.72); g.stroke();
    g.lineWidth = s * 0.02;
    g.beginPath(); g.moveTo(-s * 0.1, -s * 0.5); g.lineTo(s * 0.32, -s * 0.44); g.stroke();
    g.strokeStyle = "rgba(170,220,240,0.35)";
    g.lineWidth = Math.max(1, s * 0.006);
    g.beginPath(); g.moveTo(s * 0.14, -s * 0.72); g.lineTo(s * 0.42, -s * 0.18); g.stroke();
    g.fillStyle = "rgba(90,190,100,0.55)";
    [[-0.3, -0.12], [0.1, -0.18], [0.36, -0.2]].forEach(([mx, my]) => {
      g.beginPath(); g.ellipse(mx * s, my * s, s * 0.08, s * 0.025, -0.08, 0, Math.PI * 2); g.fill();
    });
    g.restore();
  }

  function drawPipe(g, side) {
    g.save();
    if (side < 0) { g.translate(W, 0); g.scale(-1, 1); }
    const pw = basis * 0.075;
    const y = H * 0.09;
    const reach = Math.min(W * 0.36, basis * 0.4);
    const path = () => {
      g.beginPath();
      g.moveTo(-pw, y);
      g.lineTo(reach * 0.55, y);
      g.quadraticCurveTo(reach, y, reach, -pw * 2);
    };
    g.lineCap = "butt";
    g.strokeStyle = "#07243a"; g.lineWidth = pw + 6; path(); g.stroke();
    g.strokeStyle = "#2b6180"; g.lineWidth = pw; path(); g.stroke();
    g.strokeStyle = "rgba(160,215,235,0.55)"; g.lineWidth = pw * 0.2;
    g.save(); g.translate(0, -pw * 0.22); path(); g.stroke(); g.restore();
    g.fillStyle = "#1d4a64";
    g.fillRect(reach * 0.42, y - pw * 0.65, pw * 0.5, pw * 1.3);
    g.fillStyle = "#6a9fb8";
    g.fillRect(reach * 0.42, y - pw * 0.65, pw * 0.5, pw * 0.2);

    g.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const vx = reach * (0.08 + i * 0.15);
      const len = H * (0.06 + hash(i * 3 + side) * 0.12);
      const curve = (hash(i + side * 5) - 0.5) * pw * 2;
      g.strokeStyle = "rgba(120,255,150,0.25)";
      g.lineWidth = 9;
      g.beginPath(); g.moveTo(vx, y + pw * 0.3); g.quadraticCurveTo(vx + curve, y + len * 0.6, vx - curve * 0.4, y + len); g.stroke();
      g.strokeStyle = "#48c95e";
      g.lineWidth = 3.5;
      g.beginPath(); g.moveTo(vx, y + pw * 0.3); g.quadraticCurveTo(vx + curve, y + len * 0.6, vx - curve * 0.4, y + len); g.stroke();
      g.fillStyle = "#6be07a";
      for (let t = 0.3; t < 1; t += 0.25) {
        g.beginPath(); g.ellipse(vx + curve * 0.5 * t, y + len * t, 5, 2.5, t * 3, 0, Math.PI * 2); g.fill();
      }
    }
    g.restore();
  }

  function buildVignette() {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(W * dpr));
    c.height = Math.max(1, Math.round(H * dpr));
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    const vg = g.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.8);
    vg.addColorStop(0, "rgba(0,10,30,0)");
    vg.addColorStop(1, "rgba(0,8,26,0.6)");
    g.fillStyle = vg;
    g.fillRect(0, 0, W, H);
    vignetteCanvas = c;
  }

  // ------------------------------------------------------- Ambient layers --
  function drawRays() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 6; i++) {
      const sway = reducedMotion ? 0 : Math.sin(time * 0.35 + i * 1.7) * basis * 0.04;
      const top = W / 2 + (i - 2.5) * basis * 0.16 + sway;
      const bottom = W / 2 + (i - 2.5) * basis * 0.62 + sway * 2.5;
      const a = 0.05 + 0.03 * Math.sin(time * 0.6 + i);
      const rg = ctx.createLinearGradient(0, 0, 0, cam.horizonY * 1.4);
      rg.addColorStop(0, `rgba(210,250,255,${a})`);
      rg.addColorStop(1, "rgba(210,250,255,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(top - basis * 0.025, 0);
      ctx.lineTo(top + basis * 0.025, 0);
      ctx.lineTo(bottom + basis * 0.09, cam.horizonY * 1.4);
      ctx.lineTo(bottom - basis * 0.09, cam.horizonY * 1.4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawJellies() {
    jellies.forEach(j => {
      const x = (((j.fx + time * j.drift) % 1.2) + 1.2) % 1.2 * W - W * 0.1;
      const y = j.fy * cam.horizonY + Math.sin(time * 0.8 + j.phase) * basis * 0.02;
      const s = basis * 0.05 * j.size;
      const pulse = 1 + Math.sin(time * 2.2 + j.phase) * 0.1;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const gl = ctx.createRadialGradient(x, y, 0, x, y, s * 2.4);
      gl.addColorStop(0, `rgba(${j.hue},0.35)`);
      gl.addColorStop(1, `rgba(${j.hue},0)`);
      ctx.fillStyle = gl;
      ctx.beginPath(); ctx.arc(x, y, s * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = `rgba(${j.hue},0.55)`;
      ctx.beginPath(); ctx.ellipse(x, y, s * pulse, s * 0.8 / pulse, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = `rgba(${j.hue},0.5)`;
      ctx.lineWidth = Math.max(1, s * 0.07);
      for (let i = -2; i <= 2; i++) {
        const tx = x + i * s * 0.32;
        ctx.beginPath();
        ctx.moveTo(tx, y);
        ctx.quadraticCurveTo(tx + Math.sin(time * 2 + i) * s * 0.3, y + s * 0.9, tx, y + s * 1.7);
        ctx.stroke();
      }
    });
  }

  function drawSchools(dt) {
    ctx.fillStyle = "rgba(170,230,255,0.45)";
    schools.forEach(sc => {
      if (!reducedMotion) sc.fx += sc.speed * sc.dir * dt;
      if (sc.fx > 1.25) sc.fx = -0.25;
      if (sc.fx < -0.25) sc.fx = 1.25;
      const fs = basis * 0.012;
      for (let i = 0; i < sc.count; i++) {
        const x = sc.fx * W - i * fs * 3.2 * sc.dir + Math.sin(i * 2.1) * fs * 2;
        const y = sc.fy * cam.horizonY + Math.cos(i * 1.7) * fs * 2.5 + Math.sin(time * 3 + i) * fs * 0.4;
        ctx.beginPath();
        ctx.ellipse(x, y, fs * 1.2, fs * 0.55, 0, 0, Math.PI * 2);
        ctx.moveTo(x - fs * sc.dir, y);
        ctx.lineTo(x - fs * 2 * sc.dir, y - fs * 0.6);
        ctx.lineTo(x - fs * 2 * sc.dir, y + fs * 0.6);
        ctx.fill();
      }
    });
  }

  function drawHorizonGlow() {
    const x = cam.cx - cam.camX * cam.F / (FAR + CAM_BACK);
    const y = cam.horizonY + cam.sway;
    const pulse = 0.5 + Math.sin(time * 1.6) * 0.1;
    const gg = ctx.createRadialGradient(x, y, 0, x, y, basis * 0.22);
    gg.addColorStop(0, `rgba(200,255,255,${pulse})`);
    gg.addColorStop(1, "rgba(120,230,255,0)");
    ctx.fillStyle = gg;
    ctx.fillRect(x - basis * 0.25, y - basis * 0.25, basis * 0.5, basis * 0.5);
  }

  // ---------------------------------------------------------------- Track
  function drawPillars(distance) {
    const SP = 16;
    const i0 = Math.ceil((distance + 1) / SP), i1 = Math.floor((distance + FAR * 0.8) / SP);
    for (let i = i1; i >= i0; i--) {
      const z = i * SP - distance;
      const t = fogT(z);
      ctx.fillStyle = fogged(TILE.pillar, t, 0.95);
      [-1.15, 1.15].forEach(x => {
        quad(project(x - 0.18, -0.3, z), project(x + 0.18, -0.3, z), project(x + 0.18, -5, z), project(x - 0.18, -5, z));
        ctx.fill();
      });
      ctx.fillStyle = fogged([30, 200, 220], t, 0.5);
      quad(project(-1.4, -0.34, z), project(1.4, -0.34, z), project(1.4, -0.5, z), project(-1.4, -0.5, z));
      ctx.fill();
    }
  }

  function railQuad(x, y, halfW, rgb, alpha) {
    const n1 = project(x - halfW, y, Z_NEAR), n2 = project(x + halfW, y, Z_NEAR);
    const f2 = project(x + halfW, y, FAR), f1 = project(x - halfW, y, FAR);
    const grad = ctx.createLinearGradient(0, n1.y, 0, f1.y);
    grad.addColorStop(0, `rgba(${rgb},${alpha})`);
    grad.addColorStop(0.7, `rgba(${rgb},${alpha * 0.55})`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = grad;
    quad(n1, n2, f2, f1);
    ctx.fill();
  }

  function drawChevron(xc, z0, z1, rgb, t) {
    const zb = z0 + (z1 - z0) * 0.28, zt = z0 + (z1 - z0) * 0.72;
    const a = project(xc - 0.28, 0, zb), b = project(xc, 0, zt), c = project(xc + 0.28, 0, zb);
    const s = project(xc, 0, (zb + zt) / 2).s;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = fogged(rgb, t, 0.3);
    ctx.lineWidth = s * 0.17;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.stroke();
    ctx.strokeStyle = fogged(rgb, t, 0.95);
    ctx.lineWidth = s * 0.065;
    ctx.stroke();
  }

  function drawTrack(distance) {
    // bridge side faces
    ctx.fillStyle = "#041630";
    [-1, 1].forEach(sd => {
      quad(project(sd * 1.62, 0, Z_NEAR), project(sd * 1.62, 0, FAR), project(sd * 1.62, -0.4, FAR), project(sd * 1.62, -0.4, Z_NEAR));
      ctx.fill();
    });
    // base slab (shows through as grout lines)
    const nb = project(0, 0, Z_NEAR), fb = project(0, 0, FAR);
    const baseG = ctx.createLinearGradient(0, nb.y, 0, fb.y);
    baseG.addColorStop(0, "rgb(5,20,44)");
    baseG.addColorStop(1, `rgb(${FOG[0]},${FOG[1]},${FOG[2]})`);
    ctx.fillStyle = baseG;
    quad(project(-1.62, 0, Z_NEAR), project(1.62, 0, Z_NEAR), project(1.62, 0, FAR), project(-1.62, 0, FAR));
    ctx.fill();

    const firstIdx = Math.floor((distance + Z_NEAR) / SEG);
    const lastIdx = Math.floor((distance + FAR - SEG) / SEG);
    const gap = 0.045;
    for (let idx = lastIdx; idx >= firstIdx; idx--) {
      let z0 = idx * SEG - distance;
      const z1 = z0 + SEG;
      if (z1 <= Z_NEAR) continue;
      if (z0 < Z_NEAR) z0 = Z_NEAR;
      const t = fogT(z0);
      for (let lane = 0; lane < 3; lane++) {
        const xl = -1.5 + lane + gap, xr = -0.5 + lane - gap;
        const alt = (idx + lane) % 2 === 0;
        const col = lane === 1 ? (alt ? TILE.centerA : TILE.centerB) : (alt ? TILE.sideA : TILE.sideB);
        ctx.fillStyle = fogged(col, t);
        quad(project(xl, 0, z0 + gap), project(xr, 0, z0 + gap), project(xr, 0, z1 - gap), project(xl, 0, z1 - gap));
        ctx.fill();
        if (t < 0.65) {
          ctx.fillStyle = fogged(TILE.sheen, t, lane === 1 ? 0.1 : 0.07);
          quad(project(xl + 0.08, 0, z1 - 0.7), project(xr - 0.3, 0, z1 - 0.7), project(xr - 0.08, 0, z1 - 0.12), project(xl + 0.08, 0, z1 - 0.12));
          ctx.fill();
        }
        if (lane === 1 && idx % 3 === 0 && t < 0.9) drawChevron(0, z0, z1, TILE.pink, t);
        else if (lane !== 1 && (idx * 7 + lane * 5) % 13 === 0 && t < 0.75) drawChevron(-1 + lane, z0, z1, TILE.green, t);
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    [-0.5, 0.5].forEach(x => { railQuad(x, 0, 0.1, "70,255,190", 0.22); railQuad(x, 0, 0.022, "150,255,215", 0.95); });
    [-1.5, 1.5].forEach(x => { railQuad(x, 0, 0.14, "50,230,255", 0.25); railQuad(x, 0, 0.035, "160,245,255", 1); });
    [-1.74, 1.74].forEach(x => { railQuad(x, 0.62, 0.1, "90,255,220", 0.2); railQuad(x, 0.62, 0.03, "170,255,235", 0.9); });
    ctx.restore();

    // railing posts
    const SP = 3;
    const p0 = Math.ceil((distance + Z_NEAR + 0.4) / SP), p1 = Math.floor((distance + FAR * 0.6) / SP);
    ctx.lineCap = "butt";
    for (let i = p1; i >= p0; i--) {
      const z = i * SP - distance;
      const t = fogT(z);
      [-1.74, 1.74].forEach(x => {
        const a = project(x, 0, z), b = project(x, 0.62, z);
        ctx.strokeStyle = fogged(TILE.post, t);
        ctx.lineWidth = Math.max(1, a.s * 0.05);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (i % 3 === 0) {
          ctx.fillStyle = fogged([180, 255, 240], t, 0.9);
          ctx.beginPath(); ctx.arc(b.x, b.y, Math.max(1.5, b.s * 0.06), 0, Math.PI * 2); ctx.fill();
        }
      });
    }
  }

  // ------------------------------------------------------------- Drawables
  function drawArch(z) {
    if (z < Z_NEAR + 1.2) return;
    const t = fogT(z);
    const s = project(0, 0, z).s;
    const pts = [];
    for (let y = -0.6; y <= 1.8; y += 0.6) pts.push(project(-2.05, y, z));
    for (let i = 0; i <= 16; i++) {
      const th = Math.PI - (i / 16) * Math.PI;
      pts.push(project(2.05 * Math.cos(th), 1.8 + 1.45 * Math.sin(th), z));
    }
    for (let y = 1.8; y >= -0.6; y -= 0.6) pts.push(project(2.05, y, z));
    const trace = () => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); };

    ctx.save();
    ctx.globalAlpha = 1 - t * 0.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";
    ctx.strokeStyle = fogged([36, 22, 12], t); ctx.lineWidth = s * 0.5; trace(); ctx.stroke();
    ctx.strokeStyle = fogged([122, 82, 48], t); ctx.lineWidth = s * 0.38; trace(); ctx.stroke();
    ctx.strokeStyle = fogged([168, 116, 63], t); ctx.lineWidth = s * 0.1; trace(); ctx.stroke();

    // moss along the top of the arch
    ctx.strokeStyle = fogged([92, 187, 70], t);
    ctx.lineWidth = s * 0.13;
    ctx.beginPath();
    for (let i = 3; i <= 13; i++) {
      const th = Math.PI - (i / 16) * Math.PI;
      const p = project(2.05 * Math.cos(th), 1.8 + 1.62 * Math.sin(th), z);
      i === 3 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // metal bands
    ctx.strokeStyle = fogged([160, 180, 195], t);
    ctx.lineWidth = s * 0.09;
    [Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75].forEach(th => {
      const cx = Math.cos(th), sy = Math.sin(th);
      const a = project(cx * 1.8, 1.8 + sy * 1.2, z), b = project(cx * 2.3, 1.8 + sy * 1.7, z);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    [-1, 1].forEach(sd => {
      const a = project(sd * 1.8, 0.9, z), b = project(sd * 2.3, 0.9, z);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });

    // glowing hanging vines
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = fogged([110, 255, 140], t, 0.7);
    ctx.lineWidth = Math.max(1, s * 0.035);
    [0.3, 0.42, 0.58, 0.7].forEach((f, k) => {
      const th = Math.PI - f * Math.PI;
      const x = 2.05 * Math.cos(th), y = 1.8 + 1.3 * Math.sin(th);
      const a = project(x, y, z), b = project(x + Math.sin(time + k) * 0.08, y - 0.55 - k * 0.1, z);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.restore();
  }

  function drawSpriteAt(img, x, y, z, worldW, anchorBottom, spinX) {
    const p = project(x, y, z);
    const w = worldW * p.s;
    const h = w * img.height / img.width;
    if (p.x + w < -40 || p.x - w > W + 40 || p.y - h > H + 40) return;
    const fade = clamp01((FAR - z) / 16) * (1 - fogT(z) * 0.35);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(p.x, p.y);
    if (spinX !== undefined) ctx.scale(spinX, 1);
    ctx.drawImage(img, -w / 2, anchorBottom ? -h : -h / 2, w, h);
    ctx.restore();
  }

  function drawObstacle(o, z) {
    const spec = OBSTACLE_SPECS[o.subtype];
    const img = Sprites.get(o.subtype);
    if (!img) return;
    const bob = spec.tall ? 0 : Math.sin(time * 2.2 + o.bob) * 0.05;
    const ring = project(o.laneX, 0.005, z);
    const fade = clamp01((FAR - z) / 16);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = "rgba(255,60,60,0.3)";
    ctx.beginPath(); ctx.ellipse(ring.x, ring.y, ring.s * 0.44, ring.s * 0.14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,${130 + Math.round(Math.sin(time * 6) * 60)},90,0.9)`;
    ctx.lineWidth = Math.max(1, ring.s * 0.028);
    ctx.stroke();
    ctx.restore();
    drawSpriteAt(img, o.laneX, spec.hover + bob, z, spec.w, true);
  }

  function drawCollectible(o, z) {
    const spec = COLLECTIBLE_SPECS[o.subtype];
    const img = Sprites.get(o.subtype);
    if (!img) return;
    const bob = Math.sin(time * 3 + o.bob) * 0.07;
    const spins = o.subtype === "goldenShell" || o.subtype === "cleanupToken" || o.subtype === "shell";
    const spin = spins ? Math.max(0.25, Math.abs(Math.cos(time * 2.6 + o.bob))) : 1;
    if (o.y < 0.8) {
      const sh = project(o.laneX, 0.005, z);
      ctx.fillStyle = "rgba(0,10,30,0.28)";
      ctx.beginPath(); ctx.ellipse(sh.x, sh.y, sh.s * 0.2, sh.s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    }
    // rescue pods pulse so they read as "swim here", not "dodge this"
    if (o.subtype === "rescuePod") {
      const p = project(o.laneX, o.y + bob, z);
      const rr = p.s * spec.w * (0.62 + Math.sin(time * 3.4 + o.bob) * 0.06);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const hg = ctx.createRadialGradient(p.x, p.y, rr * 0.4, p.x, p.y, rr);
      hg.addColorStop(0, "rgba(120,255,210,0.22)");
      hg.addColorStop(1, "rgba(120,255,210,0)");
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    drawSpriteAt(img, o.laneX, o.y + bob, z, spec.w, false, spin);
  }

  function drawDecor(d, x, z) {
    const img = Sprites.get(d.name);
    if (img) drawSpriteAt(img, x, -1.25, z, d.w, true);
  }

  // --------------------------------------------------------------- Player --
  function drawTurtle(tt, speed, playing) {
    const p = project(tt.x, 0.3 + tt.y, TURTLE_Z);
    const sh = project(tt.x, 0.004, TURTLE_Z);
    const scale = p.s * TURTLE_SCALE * tt.char.stats.bodyScale;

    // shadow + neon reflection
    const lift = Math.min(1, tt.y / 1.8);
    ctx.fillStyle = `rgba(0,8,24,${0.45 - lift * 0.25})`;
    ctx.beginPath(); ctx.ellipse(sh.x, sh.y, sh.s * 0.38 * (1 - lift * 0.35), sh.s * 0.12 * (1 - lift * 0.35), 0, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rg = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, sh.s * 0.8);
    rg.addColorStop(0, "rgba(80,240,200,0.22)");
    rg.addColorStop(1, "rgba(80,240,200,0)");
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.ellipse(sh.x, sh.y, sh.s * 0.8, sh.s * 0.26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    let bx = p.x;
    if (tt.bumpT > 0) bx += Math.sin(tt.bumpT * 60) * scale * 0.03;
    ctx.translate(bx, p.y);
    ctx.rotate(tt.roll + Math.sin(tt.phase * 0.5) * 0.025);
    const sq = (tt.squash / 0.18) * 0.12;
    const air = 1 + lift * 0.05;
    ctx.scale(scale * (1 + sq) * air * Math.cos(tt.roll * 0.6), scale * (1 - sq) * air);

    if (tt.invulnT > 0 && Math.floor(time * 14) % 2 === 0) ctx.globalAlpha = 0.45;

    if (tt.hitT > 0) {
      const a = Math.min(0.7, tt.hitT);
      const hg = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1.1);
      hg.addColorStop(0, `rgba(255,70,70,${a})`);
      hg.addColorStop(1, "rgba(255,70,70,0)");
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(0, 0, 1.1, 0, Math.PI * 2); ctx.fill();
    }

    tt.char.draw(ctx, tt.phase, { tint: tt.hitT > 0 ? `rgba(255,80,80,${Math.min(0.5, tt.hitT)})` : null });

    if (tt.collectT > 0) {
      const k = 1 - tt.collectT / 0.35;
      ctx.strokeStyle = `rgba(255,225,90,${1 - k})`;
      ctx.lineWidth = 0.05;
      ctx.beginPath(); ctx.arc(0, -0.05, 0.55 + k * 0.5, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();

    if (playing && !reducedMotion && Math.random() < dtLast * (6 + speed * 0.3)) {
      const side = Math.random() < 0.5 ? -1 : 1;
      burstScreen(p.x + side * scale * 0.7, p.y + scale * 0.05, ["rgba(220,250,255,0.8)"], 1, "bubble");
    }
  }

  function drawShield(tt) {
    const p = project(tt.x, 0.42 + tt.y, TURTLE_Z);
    const r = p.s * TURTLE_SCALE * tt.char.stats.bodyScale * 0.82;
    ctx.save();
    const sg = ctx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
    sg.addColorStop(0, "rgba(255,255,255,0.12)");
    sg.addColorStop(0.75, "rgba(120,230,255,0.1)");
    sg.addColorStop(0.92, "rgba(255,140,240,0.3)");
    sg.addColorStop(1, "rgba(130,245,255,0.75)");
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = Math.max(2, r * 0.03);
    ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.86, time * 2, time * 2 + 0.9); ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------- Effects --
  function burstScreen(x, y, colors, count, type) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = type === "bubble" ? 20 + Math.random() * 30 : basis * (0.15 + Math.random() * 0.35);
      particles.push({
        x, y,
        vx: type === "bubble" ? (Math.random() - 0.5) * 30 : Math.cos(a) * sp,
        vy: type === "bubble" ? 60 + Math.random() * 80 : Math.sin(a) * sp,
        life: type === "bubble" ? 0.7 : 0.5 + Math.random() * 0.4,
        age: 0,
        color: colors[i % colors.length],
        r: type === "bubble" ? 2 + Math.random() * 3 : basis * (0.006 + Math.random() * 0.01),
        type
      });
    }
  }

  function burstWorld(x, y, z, colors, count) {
    const p = project(x, y, z);
    burstScreen(p.x, p.y, colors, count, "spark");
  }

  function floatText(text, x, y, z, color) {
    const p = project(x, y, z);
    texts.push({ text, x: p.x, y: p.y, age: 0, life: 0.9, color });
  }

  function shake(mag, dur) {
    if (reducedMotion) return;
    shakeMag = mag; shakeT = dur;
  }

  function flash(rgb, dur) { flashRGB = rgb; flashT = dur; flashDur = dur; }

  let dtLast = 0.016;

  function update(dt, speed) {
    dtLast = dt;
    time += dt;
    if (!reducedMotion) cam.sway = Math.sin(time * 1.3) * basis * 0.004;
    shakeT = Math.max(0, shakeT - dt);
    flashT = Math.max(0, flashT - dt);

    const move = speed * dt;
    streaks.forEach((s, i) => {
      s.z -= move;
      if (s.z < Z_NEAR + 0.4) streaks[i] = newStreak(FAR * (0.4 + Math.random() * 0.6));
    });
    bubbles3d.forEach((b, i) => {
      b.z -= move;
      b.y += dt * 0.5;
      b.wob += dt * 3;
      if (b.z < Z_NEAR + 0.4 || b.y > 6) bubbles3d[i] = newBubble(FAR * (0.3 + Math.random() * 0.7));
    });

    particles.forEach(p => {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === "spark") { p.vx *= 0.92; p.vy = p.vy * 0.92 + basis * 0.4 * dt; }
    });
    particles = particles.filter(p => p.age < p.life);
    texts.forEach(t => { t.age += dt; t.y -= basis * 0.12 * dt; });
    texts = texts.filter(t => t.age < t.life);
  }

  function drawMotion(speed) {
    const len = Math.max(0.05, Math.min(2.2, speed * 0.045));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    streaks.forEach(s => {
      if (s.z < Z_NEAR + 0.8) return;
      const a = project(s.x, s.y, s.z), b = project(s.x, s.y, s.z + len);
      const alpha = (1 - fogT(s.z)) * 0.5;
      ctx.strokeStyle = `rgba(200,245,255,${alpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(1, a.s * 0.022);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.restore();
    ctx.lineWidth = 1;
    bubbles3d.forEach(b => {
      if (b.z < Z_NEAR + 0.8) return;
      const p = project(b.x + Math.sin(b.wob) * 0.05, b.y, b.z);
      const r = Math.max(1, b.r * p.s);
      const alpha = (1 - fogT(b.z)) * 0.6;
      ctx.strokeStyle = `rgba(230,252,255,${alpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(1, r * 0.18);
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
    });
  }

  function drawParticles() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    particles.forEach(p => {
      const k = 1 - p.age / p.life;
      ctx.globalAlpha = Math.max(0, k);
      ctx.fillStyle = p.color;
      if (p.type === "bubble") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.5 + k * 0.5), 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();

    texts.forEach(t => {
      const k = t.age / t.life;
      const size = Math.round(basis * 0.07 * (1 + (1 - k) * 0.2));
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - k * k);
      ctx.font = `700 ${size}px Fredoka, 'Arial Rounded MT Bold', system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(3, size * 0.16);
      ctx.strokeStyle = "rgba(4,20,48,0.85)";
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }

  // ------------------------------------------------------------- Frame ---
  function draw(scene) {
    const { distance, speed, turtle, objects, playing, shieldActive } = scene;
    const tt = turtle;

    cam.camX += ((tt ? tt.x * 0.45 : 0) - cam.camX) * Math.min(1, dtLast * 6);
    cam.camY += ((tt ? tt.y * 0.28 : 0) - cam.camY) * Math.min(1, dtLast * 8);

    ctx.save();
    if (shakeT > 0) {
      const m = shakeMag * (shakeT / 0.4);
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }

    if (bgCanvas) ctx.drawImage(bgCanvas, -8, -8, W + 16, H + 16);
    drawRays();
    drawSchools(dtLast);
    drawJellies();
    drawHorizonGlow();
    drawPillars(distance);
    drawTrack(distance);

    const list = [];
    const A = 50;
    for (let i = Math.ceil((distance + Z_NEAR) / A); i <= Math.floor((distance + FAR) / A); i++) {
      list.push({ z: i * A + 25 - distance, kind: "arch" });
    }
    const DS = 4.5;
    for (let i = Math.floor((distance + Z_NEAR - 4) / DS); i <= Math.floor((distance + FAR * 0.9) / DS); i++) {
      [-1, 1].forEach(side => {
        if (hash(i * 2 + (side > 0 ? 1 : 0)) < 0.15) return;
        const d = DECOR[Math.floor(hash(i * 13 + side * 7 + 3) * DECOR.length)];
        const x = side * (2.5 + hash(i * 5 + side + 11) * 3);
        const z = i * DS + hash(i * 17 + side) * 2 - distance;
        if (z > Z_NEAR + 0.6) list.push({ z, kind: "decor", d, x });
      });
    }
    if (objects) {
      objects.forEach(o => {
        if (!o.alive) return;
        const z = o.worldZ - distance;
        if (z > Z_NEAR + 0.6 && z < FAR) list.push({ z, kind: o.kind, o });
      });
    }
    if (tt) list.push({ z: TURTLE_Z, kind: "turtle" });
    list.sort((a, b) => b.z - a.z);

    list.forEach(item => {
      switch (item.kind) {
        case "arch": drawArch(item.z); break;
        case "decor": drawDecor(item.d, item.x, item.z); break;
        case "obstacle": drawObstacle(item.o, item.z); break;
        case "collectible": drawCollectible(item.o, item.z); break;
        case "turtle":
          drawTurtle(tt, speed, playing);
          if (shieldActive) drawShield(tt);
          break;
      }
    });

    drawMotion(speed);
    drawParticles();
    ctx.restore();

    if (vignetteCanvas) ctx.drawImage(vignetteCanvas, 0, 0, W, H);
    if (flashT > 0) {
      const a = (flashT / flashDur) * 0.55;
      const fg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
      fg.addColorStop(0, `rgba(${flashRGB},0)`);
      fg.addColorStop(1, `rgba(${flashRGB},${a})`);
      ctx.fillStyle = fg;
      ctx.fillRect(0, 0, W, H);
    }
  }

  const badgeCache = {};

  function characterBadgeURL(charId, size) {
    const key = charId + "@" + size;
    if (badgeCache[key]) return badgeCache[key];
    const char = CHARACTER_BY_ID[charId] || CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const g = c.getContext("2d");
    g.translate(size / 2, size * 0.54);
    g.scale(size * 0.46, size * 0.46);
    char.draw(g, 1.2, {});
    badgeCache[key] = c.toDataURL("image/png");
    return badgeCache[key];
  }

  function turtleBadgeURL(size) { return characterBadgeURL(DEFAULT_CHARACTER_ID, size); }

  return {
    init, resize, update, draw,
    burstWorld, floatText, shake, flash, turtleBadgeURL, characterBadgeURL,
    isReducedMotion: () => reducedMotion
  };
})();
