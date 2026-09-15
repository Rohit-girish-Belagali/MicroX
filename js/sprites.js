// ===================== sprites.js =====================
// Pre-rendered vector art (obstacles, collectibles, scenery) drawn once into
// offscreen canvases, then scaled in 3D by the renderer. No image assets.

const Sprites = (() => {
  const store = {};
  const urls = {};

  function mk(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return [c, c.getContext("2d")];
  }

  function glow(g, x, y, r, color) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y);
    g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r);
    g.quadraticCurveTo(x, y, x + r, y);
    g.closePath();
  }

  // ---------------------------------------------------------------- Plastic
  function bottle() {
    const [c, g] = mk(260, 400);
    glow(g, 130, 230, 170, "rgba(255,110,70,0.28)");
    g.translate(130, 220);
    g.rotate(-0.16);
    g.translate(-100, -200);

    const body = new Path2D();
    body.moveTo(52, 360);
    body.quadraticCurveTo(40, 360, 40, 340);
    body.lineTo(40, 160);
    body.bezierCurveTo(40, 120, 78, 115, 80, 80);
    body.lineTo(80, 60);
    body.lineTo(120, 60);
    body.lineTo(120, 80);
    body.bezierCurveTo(122, 115, 160, 120, 160, 160);
    body.lineTo(160, 340);
    body.quadraticCurveTo(160, 360, 148, 360);
    body.closePath();

    const lg = g.createLinearGradient(40, 0, 160, 0);
    lg.addColorStop(0, "rgba(90,170,230,0.85)");
    lg.addColorStop(0.3, "rgba(215,245,255,0.95)");
    lg.addColorStop(0.62, "rgba(140,210,245,0.85)");
    lg.addColorStop(1, "rgba(55,130,200,0.9)");
    g.fillStyle = lg;
    g.fill(body);

    g.save();
    g.clip(body);
    const lab = g.createLinearGradient(40, 0, 160, 0);
    lab.addColorStop(0, "#d93a4a");
    lab.addColorStop(0.35, "#ff6b6b");
    lab.addColorStop(1, "#b8283a");
    g.fillStyle = lab;
    g.fillRect(30, 190, 150, 72);
    g.strokeStyle = "rgba(255,255,255,0.9)";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(30, 232);
    g.bezierCurveTo(70, 205, 110, 255, 180, 222);
    g.stroke();
    g.strokeStyle = "rgba(20,60,110,0.35)";
    g.lineWidth = 4;
    [300, 322, 344].forEach(y => { g.beginPath(); g.moveTo(40, y); g.quadraticCurveTo(100, y + 10, 160, y); g.stroke(); });
    // dents: this bottle has been discarded
    g.strokeStyle = "rgba(30,80,130,0.45)";
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(60, 150); g.lineTo(96, 176); g.lineTo(80, 188); g.stroke();
    g.beginPath(); g.moveTo(150, 280); g.lineTo(118, 292); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.55)";
    roundRect(g, 52, 110, 13, 220, 6);
    g.fill();
    g.restore();

    g.strokeStyle = "rgba(255,255,255,0.9)";
    g.lineWidth = 4;
    g.stroke(body);

    const cap = g.createLinearGradient(74, 0, 126, 0);
    cap.addColorStop(0, "#1a5fd6");
    cap.addColorStop(0.4, "#5aa0ff");
    cap.addColorStop(1, "#1446a8");
    g.fillStyle = cap;
    roundRect(g, 72, 26, 56, 38, 7);
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 2;
    for (let x = 80; x < 126; x += 8) { g.beginPath(); g.moveTo(x, 30); g.lineTo(x, 60); g.stroke(); }
    return c;
  }

  function bag() {
    const [c, g] = mk(320, 330);
    glow(g, 160, 190, 170, "rgba(255,110,70,0.25)");
    const body = new Path2D();
    body.moveTo(70, 118);
    body.bezierCurveTo(40, 170, 30, 240, 44, 300);
    body.lineTo(70, 290); body.lineTo(92, 308); body.lineTo(120, 292); body.lineTo(150, 312);
    body.lineTo(182, 294); body.lineTo(212, 310); body.lineTo(244, 292); body.lineTo(276, 304);
    body.bezierCurveTo(292, 240, 282, 170, 250, 118);
    body.closePath();

    // handles
    g.strokeStyle = "rgba(235,242,250,0.9)";
    g.lineWidth = 16;
    g.lineCap = "round";
    g.beginPath(); g.moveTo(92, 124); g.bezierCurveTo(80, 30, 140, 30, 136, 124); g.stroke();
    g.beginPath(); g.moveTo(186, 124); g.bezierCurveTo(182, 36, 246, 30, 230, 124); g.stroke();

    const lg = g.createLinearGradient(40, 100, 280, 310);
    lg.addColorStop(0, "rgba(255,255,255,0.95)");
    lg.addColorStop(0.5, "rgba(214,228,244,0.85)");
    lg.addColorStop(1, "rgba(170,190,220,0.9)");
    g.fillStyle = lg;
    g.fill(body);
    g.save();
    g.clip(body);
    g.strokeStyle = "rgba(120,140,170,0.45)";
    g.lineWidth = 3;
    [[80, 140, 130, 230], [150, 130, 120, 260], [230, 150, 190, 250], [100, 250, 180, 200], [250, 200, 210, 290]]
      .forEach(([a, b, x2, y2]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + x2) / 2 + 20, (b + y2) / 2, x2, y2); g.stroke(); });
    g.fillStyle = "#e23b4e";
    g.font = "bold 30px 'Fredoka', 'Arial Rounded MT Bold', sans-serif";
    g.textAlign = "center";
    g.fillText("THANK", 160, 205);
    g.fillText("YOU", 160, 238);
    g.strokeStyle = "#e23b4e";
    g.lineWidth = 4;
    g.beginPath(); g.arc(160, 262, 14, 0.2, Math.PI - 0.2); g.stroke();
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineWidth = 4;
    g.stroke(body);
    return c;
  }

  function cup() {
    const [c, g] = mk(260, 380);
    glow(g, 130, 230, 165, "rgba(255,110,70,0.25)");
    g.translate(130, 210);
    g.rotate(0.12);
    g.translate(-120, -190);

    // straw
    g.lineCap = "round";
    g.strokeStyle = "#ffffff";
    g.lineWidth = 16;
    g.beginPath(); g.moveTo(126, 96); g.lineTo(150, 8); g.lineTo(186, -6); g.stroke();
    g.strokeStyle = "#ff4d6d";
    g.setLineDash([12, 12]);
    g.beginPath(); g.moveTo(126, 96); g.lineTo(150, 8); g.lineTo(186, -6); g.stroke();
    g.setLineDash([]);

    const body = new Path2D();
    body.moveTo(34, 106); body.lineTo(206, 106); body.lineTo(180, 356); body.lineTo(60, 356); body.closePath();
    const lg = g.createLinearGradient(34, 0, 206, 0);
    lg.addColorStop(0, "#d6e2ea");
    lg.addColorStop(0.35, "#ffffff");
    lg.addColorStop(1, "#b9c9d6");
    g.fillStyle = lg;
    g.fill(body);
    g.save();
    g.clip(body);
    g.fillStyle = "#19b3a6";
    g.fillRect(0, 180, 260, 52);
    g.fillStyle = "#ffcf3f";
    g.fillRect(0, 232, 260, 14);
    g.fillStyle = "rgba(255,255,255,0.9)";
    for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(50 + i * 30, 206, 7, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = "rgba(80,100,120,0.35)";
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(170, 120); g.lineTo(140, 170); g.lineTo(160, 176); g.stroke();
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.9)";
    g.lineWidth = 3;
    g.stroke(body);

    // lid
    const lid = g.createLinearGradient(0, 70, 0, 112);
    lid.addColorStop(0, "rgba(255,255,255,0.95)");
    lid.addColorStop(1, "rgba(190,210,225,0.95)");
    g.fillStyle = lid;
    g.beginPath(); g.ellipse(120, 104, 96, 16, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(120, 94, 76, 22, 0, Math.PI, 0); g.fill();
    g.strokeStyle = "rgba(120,140,160,0.6)";
    g.lineWidth = 2;
    g.beginPath(); g.ellipse(120, 104, 96, 16, 0, 0, Math.PI * 2); g.stroke();
    return c;
  }

  function straw() {
    const [c, g] = mk(340, 240);
    glow(g, 170, 150, 160, "rgba(255,110,70,0.25)");
    const straws = [
      { a: [40, 190], b: [300, 120], color: "#ff5c8a" },
      { a: [60, 110], b: [290, 200], color: "#27c3ff" },
      { a: [110, 215], b: [240, 70], bend: [205, 110], color: "#ffd23f" },
      { a: [30, 150], b: [320, 170], color: "#3ee08f" }
    ];
    g.lineCap = "round";
    g.lineJoin = "round";
    straws.forEach(s => {
      const path = () => {
        g.beginPath();
        g.moveTo(...s.a);
        if (s.bend) g.lineTo(...s.bend);
        g.lineTo(...s.b);
      };
      g.strokeStyle = "rgba(0,20,40,0.35)";
      g.lineWidth = 24;
      path(); g.stroke();
      g.strokeStyle = "#ffffff";
      g.lineWidth = 18;
      path(); g.stroke();
      g.strokeStyle = s.color;
      g.setLineDash([14, 12]);
      path(); g.stroke();
      g.setLineDash([]);
      g.strokeStyle = "rgba(255,255,255,0.6)";
      g.lineWidth = 4;
      path(); g.stroke();
    });
    return c;
  }

  function wrapper() {
    const [c, g] = mk(340, 260);
    glow(g, 170, 150, 165, "rgba(255,110,70,0.25)");
    g.translate(170, 140);
    g.rotate(-0.22);
    g.translate(-130, -90);

    const body = new Path2D();
    body.moveTo(20, 30);
    for (let i = 0; i <= 12; i++) body.lineTo(20 + i * 20, i % 2 ? 18 : 30);
    body.lineTo(250, 150);
    for (let i = 12; i >= 0; i--) body.lineTo(20 + i * 20, i % 2 ? 162 : 150);
    body.closePath();

    const lg = g.createLinearGradient(20, 20, 260, 170);
    lg.addColorStop(0, "#7b2ff7");
    lg.addColorStop(0.45, "#f107a3");
    lg.addColorStop(1, "#ff9f1c");
    g.fillStyle = lg;
    g.fill(body);
    g.save();
    g.clip(body);
    const shine = g.createLinearGradient(0, 30, 0, 150);
    shine.addColorStop(0, "rgba(255,255,255,0.45)");
    shine.addColorStop(0.3, "rgba(255,255,255,0)");
    shine.addColorStop(0.75, "rgba(255,255,255,0.15)");
    shine.addColorStop(1, "rgba(0,0,0,0.2)");
    g.fillStyle = shine;
    g.fillRect(0, 0, 280, 200);
    // starburst
    g.fillStyle = "#ffe14d";
    g.beginPath();
    for (let i = 0; i < 16; i++) {
      const r = i % 2 ? 26 : 44;
      const a = (i / 16) * Math.PI * 2;
      g.lineTo(90 + Math.cos(a) * r, 88 + Math.sin(a) * r);
    }
    g.closePath(); g.fill();
    g.fillStyle = "#ffffff";
    g.font = "bold 34px 'Fredoka', 'Arial Rounded MT Bold', sans-serif";
    g.textAlign = "center";
    g.fillText("SNACK", 180, 102);
    g.strokeStyle = "rgba(40,0,60,0.35)";
    g.lineWidth = 3;
    [[40, 40, 70, 150], [150, 34, 130, 150], [215, 36, 235, 150]]
      .forEach(([a, b, x2, y2]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(x2 + 10, (b + y2) / 2); g.lineTo(x2, y2); g.stroke(); });
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.7)";
    g.lineWidth = 3;
    g.stroke(body);
    return c;
  }

  function net() {
    const [c, g] = mk(320, 640);
    glow(g, 160, 360, 250, "rgba(255,90,60,0.22)");
    const top = (x) => 90 + Math.sin((x - 30) / 260 * Math.PI) * 38;

    // mesh
    g.save();
    const area = new Path2D();
    area.moveTo(34, top(34));
    for (let x = 34; x <= 286; x += 10) area.lineTo(x, top(x));
    area.lineTo(286, 600);
    area.bezierCurveTo(220, 560, 110, 630, 34, 590);
    area.closePath();
    g.clip(area);
    g.fillStyle = "rgba(40,90,90,0.18)";
    g.fillRect(0, 0, 320, 640);
    g.strokeStyle = "rgba(225,235,220,0.85)";
    g.lineWidth = 4;
    for (let k = -640; k < 640; k += 34) {
      g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 640, 640); g.stroke();
      g.beginPath(); g.moveTo(k + 640, 0); g.lineTo(k, 640); g.stroke();
    }
    // torn hole
    g.globalCompositeOperation = "destination-out";
    g.beginPath(); g.ellipse(210, 380, 40, 55, 0.4, 0, Math.PI * 2); g.fill();
    g.globalCompositeOperation = "source-over";
    g.restore();

    // tangled seaweed
    g.strokeStyle = "#3fb56a";
    g.lineWidth = 9;
    g.lineCap = "round";
    [[70, 600, 120, 420, 60, 300], [250, 600, 200, 470, 260, 360]].forEach(([x0, y0, cx, cy, x1, y1]) => {
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke();
    });

    // posts
    [22, 298].forEach(x => {
      const pg = g.createLinearGradient(x - 16, 0, x + 16, 0);
      pg.addColorStop(0, "#4a2e17");
      pg.addColorStop(0.5, "#8b5a2b");
      pg.addColorStop(1, "#3b2412");
      g.fillStyle = pg;
      roundRect(g, x - 15, 40, 30, 600, 8);
      g.fill();
      g.fillStyle = "#c9a36b";
      [120, 136, 420, 436].forEach(y => g.fillRect(x - 16, y, 32, 8));
      g.fillStyle = "#5fae3a";
      g.beginPath(); g.ellipse(x, 44, 18, 10, 0, 0, Math.PI * 2); g.fill();
    });

    // top rope + floats
    g.strokeStyle = "#e8d7a8";
    g.lineWidth = 8;
    g.beginPath();
    for (let x = 22; x <= 298; x += 6) (x === 22 ? g.moveTo(x, top(x)) : g.lineTo(x, top(x)));
    g.stroke();
    [80, 160, 240].forEach(x => {
      const fg = g.createRadialGradient(x - 8, top(x) - 6, 2, x, top(x), 26);
      fg.addColorStop(0, "#ffd29a");
      fg.addColorStop(1, "#ff6a13");
      g.fillStyle = fg;
      g.beginPath(); g.ellipse(x, top(x), 26, 19, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.8)";
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(x - 26, top(x)); g.lineTo(x + 26, top(x)); g.stroke();
    });
    return c;
  }

  // ------------------------------------------------------------ Collectibles
  function fish() {
    const [c, g] = mk(220, 220);
    glow(g, 110, 110, 108, "rgba(120,230,255,0.55)");
    g.translate(110, 110);
    const bg = g.createLinearGradient(0, -40, 0, 40);
    bg.addColorStop(0, "#ffcf6b");
    bg.addColorStop(1, "#ff6a2b");
    g.fillStyle = "#ff8c3a";
    g.beginPath(); g.moveTo(-46, 0); g.lineTo(-84, -34); g.quadraticCurveTo(-72, 0, -84, 34); g.closePath(); g.fill();
    g.fillStyle = bg;
    g.beginPath(); g.ellipse(4, 0, 56, 36, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffffff";
    [[-14, 10], [22, 8]].forEach(([x, w]) => { g.beginPath(); g.ellipse(x, 0, w, 34, 0, 0, Math.PI * 2); g.fill(); });
    g.strokeStyle = "#2a1a10";
    g.lineWidth = 3;
    [[-14, 10], [22, 8]].forEach(([x, w]) => { g.beginPath(); g.ellipse(x, 0, w, 34, 0, 0, Math.PI * 2); g.stroke(); });
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(40, -8, 10, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#101820";
    g.beginPath(); g.arc(43, -8, 5.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.beginPath(); g.ellipse(4, -20, 30, 8, 0, 0, Math.PI * 2); g.fill();
    return c;
  }

  function seaweed() {
    const [c, g] = mk(220, 240);
    glow(g, 110, 130, 110, "rgba(120,255,160,0.5)");
    g.lineCap = "round";
    [[-34, "#2fae66"], [0, "#48d67f"], [34, "#27945a"]].forEach(([dx, col]) => {
      const lg = g.createLinearGradient(0, 220, 0, 30);
      lg.addColorStop(0, col);
      lg.addColorStop(1, "#b8ffcb");
      g.fillStyle = lg;
      g.beginPath();
      g.moveTo(110 + dx - 8, 215);
      g.bezierCurveTo(110 + dx - 50, 150, 110 + dx + 40, 100, 110 + dx - 4, 34);
      g.bezierCurveTo(110 + dx + 60, 100, 110 + dx - 10, 150, 110 + dx + 10, 215);
      g.closePath();
      g.fill();
    });
    g.fillStyle = "#8a5a3a";
    g.beginPath(); g.ellipse(110, 216, 44, 10, 0, 0, Math.PI * 2); g.fill();
    return c;
  }

  function scallop(colors, glowColor, sparkle) {
    const [c, g] = mk(230, 230);
    glow(g, 115, 118, 112, glowColor);
    g.translate(115, 128);
    const sg = g.createLinearGradient(0, -80, 0, 60);
    sg.addColorStop(0, colors[0]);
    sg.addColorStop(1, colors[1]);
    g.fillStyle = sg;
    g.beginPath();
    g.moveTo(0, 58);
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      const r = 80;
      const bump = i % 1 === 0 ? 8 : 0;
      g.quadraticCurveTo(Math.cos(a - 0.1) * (r + bump), Math.sin(a - 0.1) * (r + bump) - 10, Math.cos(a) * r, Math.sin(a) * r - 10);
    }
    g.closePath();
    g.fill();
    g.strokeStyle = colors[2];
    g.lineWidth = 5;
    for (let i = 1; i < 8; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      g.beginPath(); g.moveTo(0, 54); g.lineTo(Math.cos(a) * 74, Math.sin(a) * 74 - 10); g.stroke();
    }
    g.fillStyle = colors[1];
    g.beginPath(); g.moveTo(-26, 50); g.lineTo(26, 50); g.lineTo(18, 70); g.lineTo(-18, 70); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.45)";
    g.beginPath(); g.ellipse(-24, -46, 20, 9, -0.5, 0, Math.PI * 2); g.fill();
    if (sparkle) {
      g.fillStyle = "#fffbe0";
      [[58, -70, 14], [-66, -20, 9], [44, 30, 8]].forEach(([x, y, r]) => {
        g.beginPath();
        g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
        g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r);
        g.fill();
      });
    }
    return c;
  }

  function shieldBubble() {
    const [c, g] = mk(240, 240);
    glow(g, 120, 120, 118, "rgba(110,220,255,0.55)");
    const bg = g.createRadialGradient(95, 90, 10, 120, 120, 88);
    bg.addColorStop(0, "rgba(255,255,255,0.55)");
    bg.addColorStop(0.6, "rgba(120,220,255,0.25)");
    bg.addColorStop(0.9, "rgba(255,120,230,0.45)");
    bg.addColorStop(1, "rgba(120,240,255,0.9)");
    g.fillStyle = bg;
    g.beginPath(); g.arc(120, 120, 86, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.9)";
    g.lineWidth = 4;
    g.stroke();
    const sh = g.createLinearGradient(0, 70, 0, 170);
    sh.addColorStop(0, "#7ff9ff");
    sh.addColorStop(1, "#1e88e5");
    g.fillStyle = sh;
    g.beginPath();
    g.moveTo(120, 64); g.lineTo(162, 80); g.quadraticCurveTo(164, 140, 120, 172);
    g.quadraticCurveTo(76, 140, 78, 80); g.closePath();
    g.fill();
    g.strokeStyle = "#ffffff";
    g.lineWidth = 6;
    g.stroke();
    g.fillStyle = "rgba(255,255,255,0.8)";
    g.beginPath(); g.ellipse(86, 78, 20, 10, -0.7, 0, Math.PI * 2); g.fill();
    return c;
  }

  function cleanupToken() {
    const [c, g] = mk(230, 230);
    glow(g, 115, 115, 112, "rgba(120,255,170,0.55)");
    const cg = g.createLinearGradient(40, 40, 190, 190);
    cg.addColorStop(0, "#b6ff8a");
    cg.addColorStop(0.5, "#2fd17a");
    cg.addColorStop(1, "#128a56");
    g.fillStyle = "#0b6b43";
    g.beginPath(); g.arc(115, 121, 80, 0, Math.PI * 2); g.fill();
    g.fillStyle = cg;
    g.beginPath(); g.arc(115, 113, 80, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.7)";
    g.lineWidth = 6;
    g.beginPath(); g.arc(115, 113, 64, 0, Math.PI * 2); g.stroke();
    g.translate(115, 113);
    g.fillStyle = "#ffffff";
    for (let i = 0; i < 3; i++) {
      g.save();
      g.rotate((i / 3) * Math.PI * 2);
      g.beginPath();
      g.moveTo(-20, -34); g.lineTo(14, -34); g.lineTo(14, -44); g.lineTo(34, -26); g.lineTo(14, -8); g.lineTo(14, -18); g.lineTo(-12, -18);
      g.closePath();
      g.fill();
      g.restore();
    }
    return c;
  }

  // ----------------------------------------------------------------- Scenery
  function anemone(hueA, hueB) {
    const [c, g] = mk(300, 300);
    g.lineCap = "round";
    for (let i = 0; i < 26; i++) {
      const a = Math.PI + 0.25 + (i / 25) * (Math.PI - 0.5);
      const len = 110 + ((i * 37) % 40);
      const x1 = 150 + Math.cos(a) * len * 1.1;
      const y1 = 270 + Math.sin(a) * len;
      const lg = g.createLinearGradient(150, 270, x1, y1);
      lg.addColorStop(0, hueA);
      lg.addColorStop(1, hueB);
      g.strokeStyle = lg;
      g.lineWidth = 16;
      g.beginPath();
      g.moveTo(150, 276);
      g.quadraticCurveTo(150 + Math.cos(a + 0.4) * len * 0.6, 270 + Math.sin(a + 0.4) * len * 0.6, x1, y1);
      g.stroke();
      g.fillStyle = hueB;
      g.beginPath(); g.arc(x1, y1, 9, 0, Math.PI * 2); g.fill();
    }
    const mound = g.createRadialGradient(150, 280, 10, 150, 290, 80);
    mound.addColorStop(0, hueA);
    mound.addColorStop(1, "#3a1640");
    g.fillStyle = mound;
    g.beginPath(); g.ellipse(150, 288, 80, 22, 0, 0, Math.PI * 2); g.fill();
    return c;
  }

  function tubeCoral() {
    const [c, g] = mk(260, 340);
    const tubes = [[70, 150, 34], [120, 70, 40], [175, 120, 36], [210, 200, 28], [40, 220, 26]];
    tubes.forEach(([x, top, r]) => {
      const lg = g.createLinearGradient(x - r, 0, x + r, 0);
      lg.addColorStop(0, "#7a2f9e");
      lg.addColorStop(0.5, "#d86bff");
      lg.addColorStop(1, "#5d2380");
      g.fillStyle = lg;
      roundRect(g, x - r, top, r * 2, 340 - top, r * 0.6);
      g.fill();
      g.fillStyle = "#ff9be8";
      g.beginPath(); g.ellipse(x, top + 6, r, r * 0.38, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#3a0f52";
      g.beginPath(); g.ellipse(x, top + 7, r * 0.66, r * 0.22, 0, 0, Math.PI * 2); g.fill();
    });
    return c;
  }

  function kelp() {
    const [c, g] = mk(200, 520);
    g.lineCap = "round";
    [[60, "#1f8f4e"], [110, "#35c46b"], [150, "#1a7a43"]].forEach(([x, col], k) => {
      g.strokeStyle = col;
      g.lineWidth = 12;
      g.beginPath();
      g.moveTo(x, 520);
      g.bezierCurveTo(x - 40, 380, x + 40, 240, x - 10 + k * 8, 20 + k * 40);
      g.stroke();
      g.fillStyle = col;
      for (let t = 0.15; t < 0.95; t += 0.12) {
        const y = 520 - t * (500 - k * 40);
        const side = Math.round(t * 10) % 2 ? 1 : -1;
        g.beginPath();
        g.ellipse(x + side * 22 + Math.sin(t * 6) * 20, y, 26, 10, side * 0.5, 0, Math.PI * 2);
        g.fill();
      }
    });
    return c;
  }

  function fanCoral() {
    const [c, g] = mk(300, 320);
    g.lineCap = "round";
    function branch(x, y, a, len, w, depth) {
      const x2 = x + Math.cos(a) * len;
      const y2 = y + Math.sin(a) * len;
      g.strokeStyle = depth > 2 ? "#ff7eb6" : "#e0508f";
      g.lineWidth = w;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
      if (depth < 5) {
        branch(x2, y2, a - 0.38, len * 0.74, w * 0.72, depth + 1);
        branch(x2, y2, a + 0.38, len * 0.74, w * 0.72, depth + 1);
      } else {
        g.fillStyle = "#ffd1e6";
        g.beginPath(); g.arc(x2, y2, 4, 0, Math.PI * 2); g.fill();
      }
    }
    branch(150, 318, -Math.PI / 2, 80, 16, 0);
    return c;
  }

  function rock() {
    const [c, g] = mk(320, 220);
    const rg = g.createLinearGradient(0, 40, 0, 220);
    rg.addColorStop(0, "#3d6f8f");
    rg.addColorStop(1, "#122f47");
    g.fillStyle = rg;
    g.beginPath();
    g.moveTo(10, 220); g.quadraticCurveTo(30, 90, 110, 70); g.quadraticCurveTo(170, 20, 230, 70);
    g.quadraticCurveTo(310, 100, 310, 220); g.closePath();
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.12)";
    g.beginPath(); g.ellipse(140, 70, 60, 16, -0.2, 0, Math.PI * 2); g.fill();
    [[90, 80, "#ff8a5b"], [200, 55, "#ffd23f"], [260, 95, "#ff6bb0"]].forEach(([x, y, col]) => {
      g.fillStyle = col;
      for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x + Math.cos(i) * 12, y - Math.abs(Math.sin(i)) * 14, 7, 0, Math.PI * 2); g.fill(); }
    });
    return c;
  }

  // --------------------------------------------------------------- Registry
  function init() {
    Object.assign(store, {
      bottle: bottle(), bag: bag(), cup: cup(), straw: straw(), wrapper: wrapper(), net: net(),
      fish: fish(), seaweed: seaweed(),
      shell: scallop(["#ffd6e4", "#ff7fa8", "rgba(200,60,110,0.45)"], "rgba(255,170,210,0.5)", false),
      goldenShell: scallop(["#fff3a8", "#f5a623", "rgba(170,100,10,0.5)"], "rgba(255,210,80,0.75)", true),
      shieldBubble: shieldBubble(), cleanupToken: cleanupToken(),
      anemoneOrange: anemone("#ff6a3d", "#ffc48a"), anemonePink: anemone("#e0508f", "#ffb3e0"),
      tubeCoral: tubeCoral(), kelp: kelp(), fanCoral: fanCoral(), rock: rock()
    });
  }

  function get(name) { return store[name]; }

  function url(name) {
    if (!urls[name] && store[name]) urls[name] = store[name].toDataURL("image/png");
    return urls[name];
  }

  return { init, get, url };
})();
