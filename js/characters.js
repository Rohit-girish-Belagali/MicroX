// ===================== characters.js =====================
// The four playable guardians. Each draw() paints the creature seen from
// behind, centred on (0,0) in a roughly +/-0.55 unit box, animated off `phase`.
// opts.tint is an rgba fill laid over the body for the red hit-flash.

const CHARACTERS = (() => {

  // ------------------------------------------------------------ Sea Turtle --
  function drawTurtle(g, phase, opts) {
    const o = opts || {};
    const stroke = Math.sin(phase);
    const kick = Math.sin(phase + Math.PI * 0.6);
    const headBob = Math.sin(phase * 2) * 0.012;

    const skin = g.createLinearGradient(0, -0.7, 0, 0.5);
    skin.addColorStop(0, "#8fd694");
    skin.addColorStop(1, "#4b9a63");

    // rear flippers
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.24, 0.3);
      g.rotate(side * (0.45 + kick * 0.35));
      g.scale(side, 1);
      g.fillStyle = "#4a9a62";
      g.beginPath();
      g.moveTo(-0.04, -0.02);
      g.quadraticCurveTo(0.16, 0.04, 0.1, 0.3);
      g.quadraticCurveTo(-0.02, 0.24, -0.06, 0.04);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(10,50,30,0.5)";
      g.lineWidth = 0.014;
      g.stroke();
      g.restore();
    });
    g.fillStyle = "#4a9a62";
    g.beginPath(); g.moveTo(-0.05, 0.38); g.lineTo(0.05, 0.38); g.lineTo(0, 0.5); g.closePath(); g.fill();

    // body skin & head
    g.fillStyle = "#3f8757";
    g.beginPath(); g.ellipse(0, -0.06, 0.38, 0.44, 0, 0, Math.PI * 2); g.fill();
    g.save();
    g.translate(0, -0.52 + headBob);
    g.fillStyle = skin;
    g.beginPath(); g.ellipse(0, 0, 0.15, 0.18, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(220,255,200,0.5)";
    [[-0.05, -0.06, 0.035], [0.05, -0.05, 0.03], [0, -0.12, 0.028], [0.07, 0.03, 0.025], [-0.07, 0.02, 0.025]]
      .forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); });
    [-1, 1].forEach(side => {
      g.fillStyle = "#0e2a1a";
      g.beginPath(); g.ellipse(side * 0.135, -0.02, 0.03, 0.04, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(side * 0.13, -0.035, 0.011, 0, Math.PI * 2); g.fill();
    });
    g.restore();

    // front flippers (power stroke)
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.33, -0.2);
      g.rotate(side * (-0.35 + stroke * 0.85));
      g.scale(side, 0.82 + 0.18 * Math.cos(phase));
      const fg = g.createLinearGradient(0, 0, 0.68, 0);
      fg.addColorStop(0, "#5cb676");
      fg.addColorStop(1, "#2f7a4c");
      g.fillStyle = fg;
      g.beginPath();
      g.moveTo(-0.03, -0.07);
      g.bezierCurveTo(0.2, -0.16, 0.5, -0.1, 0.7, 0.05);
      g.bezierCurveTo(0.52, 0.09, 0.26, 0.11, -0.03, 0.08);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(8,45,25,0.55)";
      g.lineWidth = 0.016;
      g.stroke();
      g.fillStyle = "rgba(215,250,200,0.55)";
      [[0.14, -0.03, 0.035], [0.29, -0.02, 0.03], [0.43, 0.0, 0.026], [0.56, 0.03, 0.02], [0.2, 0.04, 0.024]]
        .forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r * 1.3, r, 0, 0, Math.PI * 2); g.fill(); });
      g.strokeStyle = "rgba(255,255,255,0.35)";
      g.lineWidth = 0.014;
      g.beginPath(); g.moveTo(0.02, -0.08); g.bezierCurveTo(0.22, -0.15, 0.48, -0.1, 0.66, 0.03); g.stroke();
      g.restore();
    });

    // shell
    g.fillStyle = "#6b4d22";
    g.beginPath(); g.ellipse(0, 0.01, 0.475, 0.455, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#c9a14f";
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      g.beginPath();
      g.ellipse(Math.cos(a) * 0.445, 0.01 + Math.sin(a) * 0.425, 0.042, 0.03, a, 0, Math.PI * 2);
      g.fill();
    }
    const shell = g.createRadialGradient(-0.12, -0.17, 0.02, 0, 0, 0.46);
    shell.addColorStop(0, "#a6e27a");
    shell.addColorStop(0.5, "#4fa35a");
    shell.addColorStop(1, "#2a6a3c");
    g.fillStyle = shell;
    g.beginPath(); g.ellipse(0, 0, 0.42, 0.4, 0, 0, Math.PI * 2); g.fill();

    g.save();
    g.beginPath(); g.ellipse(0, 0, 0.42, 0.4, 0, 0, Math.PI * 2); g.clip();
    g.strokeStyle = "rgba(235,255,170,0.6)";
    g.lineWidth = 0.02;
    g.lineJoin = "round";
    const hexes = [-0.24, -0.02, 0.2];
    hexes.forEach(cy => {
      g.beginPath();
      g.moveTo(-0.08, cy - 0.1); g.lineTo(0.08, cy - 0.1); g.lineTo(0.12, cy); g.lineTo(0.08, cy + 0.1);
      g.lineTo(-0.08, cy + 0.1); g.lineTo(-0.12, cy); g.closePath();
      g.stroke();
      [-1, 1].forEach(sd => {
        g.beginPath(); g.moveTo(sd * 0.12, cy); g.lineTo(sd * 0.45, cy + 0.02); g.stroke();
      });
    });
    [-1, 1].forEach(sd => {
      g.beginPath(); g.moveTo(sd * 0.08, -0.34); g.lineTo(sd * 0.3, -0.36); g.stroke();
      g.beginPath(); g.moveTo(sd * 0.08, 0.3); g.lineTo(sd * 0.3, 0.34); g.stroke();
    });
    g.fillStyle = "rgba(255,255,255,0.28)";
    g.beginPath(); g.ellipse(-0.15, -0.2, 0.15, 0.07, -0.5, 0, Math.PI * 2); g.fill();
    g.restore();

    if (o.tint) {
      g.fillStyle = o.tint;
      g.beginPath(); g.ellipse(0, 0, 0.42, 0.4, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // --------------------------------------------------------------- Dolphin --
  function drawDolphin(g, phase, opts) {
    const o = opts || {};
    const fluke = Math.sin(phase);           // vertical tail beat
    const pec = Math.sin(phase + 1.1);       // pectoral fin sweep
    const bob = Math.sin(phase * 2) * 0.016;

    // tail stock + horizontal flukes (dolphins beat up and down, so from
    // behind the flukes read as a wide shape sliding vertically)
    g.save();
    g.translate(0, 0.34 + fluke * 0.05);
    g.rotate(fluke * 0.18);
    const fg = g.createLinearGradient(0, 0, 0, 0.2);
    fg.addColorStop(0, "#4a6f92");
    fg.addColorStop(1, "#2b4666");
    g.fillStyle = fg;
    g.beginPath();
    g.moveTo(0, -0.04);
    g.bezierCurveTo(0.2, 0.0, 0.36, 0.08, 0.42, 0.2);
    g.bezierCurveTo(0.24, 0.17, 0.1, 0.13, 0, 0.12);
    g.bezierCurveTo(-0.1, 0.13, -0.24, 0.17, -0.42, 0.2);
    g.bezierCurveTo(-0.36, 0.08, -0.2, 0.0, 0, -0.04);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(10,28,48,0.5)";
    g.lineWidth = 0.014;
    g.stroke();
    g.restore();

    // pectoral fins
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.28, -0.02);
      g.rotate(side * (0.5 + pec * 0.3));
      g.scale(side, 1);
      const pg = g.createLinearGradient(0, 0, 0.42, 0.1);
      pg.addColorStop(0, "#5b83a8");
      pg.addColorStop(1, "#2f4d6f");
      g.fillStyle = pg;
      g.beginPath();
      g.moveTo(-0.02, -0.06);
      g.bezierCurveTo(0.16, -0.04, 0.34, 0.06, 0.44, 0.2);
      g.bezierCurveTo(0.26, 0.17, 0.08, 0.1, -0.03, 0.05);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(10,28,48,0.5)";
      g.lineWidth = 0.014;
      g.stroke();
      g.restore();
    });

    // body — torpedo tapering to the tail stock
    const body = g.createLinearGradient(-0.2, -0.5, 0.22, 0.4);
    body.addColorStop(0, "#9fc3de");
    body.addColorStop(0.45, "#5d87ad");
    body.addColorStop(1, "#2c4a6b");
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, -0.56);
    g.bezierCurveTo(0.3, -0.5, 0.4, -0.12, 0.26, 0.18);
    g.bezierCurveTo(0.16, 0.34, 0.08, 0.36, 0, 0.36);
    g.bezierCurveTo(-0.08, 0.36, -0.16, 0.34, -0.26, 0.18);
    g.bezierCurveTo(-0.4, -0.12, -0.3, -0.5, 0, -0.56);
    g.closePath();
    g.fill();

    // pale belly wrapping round the sides
    g.save();
    g.beginPath();
    g.moveTo(0, -0.56);
    g.bezierCurveTo(0.3, -0.5, 0.4, -0.12, 0.26, 0.18);
    g.bezierCurveTo(0.16, 0.34, 0.08, 0.36, 0, 0.36);
    g.bezierCurveTo(-0.08, 0.36, -0.16, 0.34, -0.26, 0.18);
    g.bezierCurveTo(-0.4, -0.12, -0.3, -0.5, 0, -0.56);
    g.closePath();
    g.clip();
    g.fillStyle = "rgba(236,247,255,0.5)";
    g.beginPath(); g.ellipse(0, 0.14, 0.3, 0.3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,255,255,0.3)";
    g.beginPath(); g.ellipse(-0.14, -0.26, 0.09, 0.26, 0.2, 0, Math.PI * 2); g.fill();
    g.restore();

    // dorsal fin
    g.save();
    g.translate(0, -0.18 + bob);
    g.rotate(Math.sin(phase) * 0.05);
    const dg = g.createLinearGradient(0, -0.3, 0.1, 0.05);
    dg.addColorStop(0, "#8fb3d2");
    dg.addColorStop(1, "#33547a");
    g.fillStyle = dg;
    g.beginPath();
    g.moveTo(-0.09, 0.06);
    g.bezierCurveTo(-0.05, -0.16, 0.0, -0.3, 0.09, -0.36);
    g.bezierCurveTo(0.08, -0.16, 0.08, -0.02, 0.1, 0.06);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(10,28,48,0.45)";
    g.lineWidth = 0.014;
    g.stroke();
    g.restore();

    // head + blowhole, peeking over the back
    g.save();
    g.translate(0, -0.52 + bob);
    const hg = g.createLinearGradient(0, -0.16, 0, 0.12);
    hg.addColorStop(0, "#b3d2e9");
    hg.addColorStop(1, "#6b93b7");
    g.fillStyle = hg;
    g.beginPath(); g.ellipse(0, 0, 0.19, 0.15, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(20,46,72,0.75)";
    g.beginPath(); g.ellipse(0, -0.05, 0.035, 0.022, 0, 0, Math.PI * 2); g.fill();
    [-1, 1].forEach(side => {
      g.fillStyle = "#12283f";
      g.beginPath(); g.ellipse(side * 0.15, 0.01, 0.026, 0.034, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(side * 0.145, -0.002, 0.01, 0, Math.PI * 2); g.fill();
    });
    g.restore();

    if (o.tint) {
      g.fillStyle = o.tint;
      g.beginPath(); g.ellipse(0, -0.1, 0.34, 0.44, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // ------------------------------------------------------------ Manta Ray --
  function drawManta(g, phase, opts) {
    const o = opts || {};
    const flap = Math.sin(phase);            // wings rise and fall together
    const tailWave = Math.sin(phase + 0.8);

    // whip tail, behind the body
    g.save();
    g.strokeStyle = "#1f3b5c";
    g.lineWidth = 0.035;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, 0.18);
    g.quadraticCurveTo(tailWave * 0.08, 0.36, tailWave * 0.14, 0.56);
    g.stroke();
    g.restore();

    // wings — drawn as one swept shape per side so the flap reads clearly
    [-1, 1].forEach(side => {
      g.save();
      g.scale(side, 1);
      const tipLift = flap * 0.2;
      const wg = g.createLinearGradient(0, -0.1, 0.62, 0.1);
      wg.addColorStop(0, "#43648c");
      wg.addColorStop(0.6, "#2c4a72");
      wg.addColorStop(1, "#1b3358");
      g.fillStyle = wg;
      g.beginPath();
      g.moveTo(0.04, -0.2);
      g.bezierCurveTo(0.26, -0.26 - tipLift * 0.5, 0.5, -0.2 - tipLift, 0.68, -0.12 - tipLift);
      g.bezierCurveTo(0.52, 0.02 - tipLift * 0.6, 0.3, 0.12, 0.06, 0.18);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(8,22,44,0.55)";
      g.lineWidth = 0.016;
      g.stroke();
      // wing ribs
      g.strokeStyle = "rgba(150,200,240,0.25)";
      g.lineWidth = 0.012;
      [0.0, 0.06, 0.12].forEach((dy, i) => {
        g.beginPath();
        g.moveTo(0.08, -0.12 + dy);
        g.quadraticCurveTo(0.34, -0.14 + dy - tipLift * 0.5, 0.6, -0.1 + dy * 0.6 - tipLift);
        g.stroke();
      });
      // pale leading-edge highlight
      g.strokeStyle = "rgba(210,238,255,0.35)";
      g.lineWidth = 0.02;
      g.beginPath();
      g.moveTo(0.06, -0.19);
      g.bezierCurveTo(0.28, -0.25 - tipLift * 0.5, 0.5, -0.19 - tipLift, 0.66, -0.12 - tipLift);
      g.stroke();
      g.restore();
    });

    // central body disc
    const body = g.createLinearGradient(0, -0.4, 0, 0.26);
    body.addColorStop(0, "#5d82ad");
    body.addColorStop(0.5, "#33537d");
    body.addColorStop(1, "#1d3659");
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, -0.06, 0.24, 0.32, 0, 0, Math.PI * 2); g.fill();

    // the pale spot pattern each manta is individually identified by
    g.save();
    g.beginPath(); g.ellipse(0, -0.06, 0.24, 0.32, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = "rgba(220,242,255,0.4)";
    [[-0.09, -0.2, 0.035], [0.08, -0.16, 0.03], [-0.04, -0.05, 0.04], [0.1, 0.04, 0.032], [-0.1, 0.08, 0.028]]
      .forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r * 1.2, r, 0, 0, Math.PI * 2); g.fill(); });
    g.fillStyle = "rgba(255,255,255,0.22)";
    g.beginPath(); g.ellipse(-0.08, -0.22, 0.08, 0.16, 0.3, 0, Math.PI * 2); g.fill();
    g.restore();

    // cephalic lobes (the rolled "horns") and eyes, seen past the head
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.16, -0.36);
      g.rotate(side * (0.3 + flap * 0.12));
      g.fillStyle = "#4b6f99";
      g.beginPath();
      g.moveTo(0, 0.04);
      g.quadraticCurveTo(side * 0.06, -0.08, side * 0.03, -0.17);
      g.quadraticCurveTo(-side * 0.03, -0.09, -0.04, 0.03);
      g.closePath();
      g.fill();
      g.restore();
      g.fillStyle = "#0d2036";
      g.beginPath(); g.ellipse(side * 0.2, -0.28, 0.028, 0.034, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(side * 0.195, -0.292, 0.01, 0, Math.PI * 2); g.fill();
    });

    if (o.tint) {
      g.fillStyle = o.tint;
      g.beginPath(); g.ellipse(0, -0.06, 0.42, 0.34, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // -------------------------------------------------------------- Sea Otter --
  function drawOtter(g, phase, opts) {
    const o = opts || {};
    const paddle = Math.sin(phase);
    const paw = Math.sin(phase + 1.4);
    const bob = Math.sin(phase * 2) * 0.014;

    // flat rudder tail
    g.save();
    g.translate(0, 0.32);
    g.rotate(paddle * 0.22);
    g.fillStyle = "#6b4a30";
    g.beginPath();
    g.moveTo(-0.08, -0.04);
    g.quadraticCurveTo(-0.1, 0.16, -0.04, 0.3);
    g.quadraticCurveTo(0.0, 0.34, 0.04, 0.3);
    g.quadraticCurveTo(0.1, 0.16, 0.08, -0.04);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(38,22,10,0.5)";
    g.lineWidth = 0.014;
    g.stroke();
    g.restore();

    // hind feet, webbed, paddling out of phase with each other
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.2, 0.26);
      g.rotate(side * (0.35 + paddle * side * 0.3));
      g.fillStyle = "#5c3f28";
      g.beginPath();
      g.moveTo(0, -0.03);
      g.quadraticCurveTo(side * 0.14, 0.06, side * 0.12, 0.22);
      g.quadraticCurveTo(0, 0.18, -side * 0.04, 0.04);
      g.closePath();
      g.fill();
      g.restore();
    });

    // body — dense fur, drawn as stacked strokes over a base
    const fur = g.createRadialGradient(-0.1, -0.2, 0.04, 0, 0, 0.5);
    fur.addColorStop(0, "#a8794f");
    fur.addColorStop(0.55, "#7a5333");
    fur.addColorStop(1, "#4d331e");
    g.fillStyle = fur;
    g.beginPath(); g.ellipse(0, -0.02, 0.36, 0.42, 0, 0, Math.PI * 2); g.fill();

    g.save();
    g.beginPath(); g.ellipse(0, -0.02, 0.36, 0.42, 0, 0, Math.PI * 2); g.clip();
    g.strokeStyle = "rgba(210,170,125,0.3)";
    g.lineWidth = 0.016;
    g.lineCap = "round";
    for (let i = 0; i < 16; i++) {
      const fx = -0.3 + (i % 8) * 0.085;
      const fy = -0.3 + Math.floor(i / 8) * 0.34;
      g.beginPath();
      g.moveTo(fx, fy);
      g.quadraticCurveTo(fx + 0.03, fy + 0.07, fx - 0.01, fy + 0.13);
      g.stroke();
    }
    g.fillStyle = "rgba(255,240,215,0.2)";
    g.beginPath(); g.ellipse(-0.13, -0.2, 0.12, 0.16, -0.4, 0, Math.PI * 2); g.fill();
    g.restore();

    // forepaws clutching a favourite stone — otters really do keep one
    [-1, 1].forEach(side => {
      g.save();
      g.translate(side * 0.29, -0.16 + paw * 0.03);
      g.rotate(side * (-0.2 + paw * 0.25));
      g.fillStyle = "#6b4a30";
      g.beginPath(); g.ellipse(0, 0, 0.1, 0.13, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#3a2615";
      [-0.03, 0.01, 0.05].forEach(dx => {
        g.beginPath(); g.ellipse(dx, 0.08, 0.015, 0.022, 0, 0, Math.PI * 2); g.fill();
      });
      g.restore();
    });
    g.fillStyle = "#8d9aa6";
    g.beginPath(); g.ellipse(0, -0.14, 0.1, 0.08, 0.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,255,255,0.3)";
    g.beginPath(); g.ellipse(-0.03, -0.17, 0.04, 0.025, 0.2, 0, Math.PI * 2); g.fill();

    // head — pale muzzle, round ears, whiskers
    g.save();
    g.translate(0, -0.5 + bob);
    const hg = g.createRadialGradient(-0.04, -0.06, 0.02, 0, 0, 0.22);
    hg.addColorStop(0, "#c49a6c");
    hg.addColorStop(1, "#7a5333");
    [-1, 1].forEach(side => {
      g.fillStyle = "#63432a";
      g.beginPath(); g.ellipse(side * 0.16, -0.08, 0.05, 0.045, 0, 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = hg;
    g.beginPath(); g.ellipse(0, 0, 0.18, 0.16, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(246,228,200,0.85)";
    g.beginPath(); g.ellipse(0, 0.06, 0.12, 0.09, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#2a1a0d";
    g.beginPath(); g.ellipse(0, 0.03, 0.035, 0.026, 0, 0, Math.PI * 2); g.fill();
    [-1, 1].forEach(side => {
      g.fillStyle = "#1c1109";
      g.beginPath(); g.ellipse(side * 0.095, -0.04, 0.027, 0.03, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(side * 0.09, -0.052, 0.01, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(255,245,225,0.45)";
      g.lineWidth = 0.008;
      [-0.01, 0.02, 0.05].forEach(dy => {
        g.beginPath();
        g.moveTo(side * 0.08, 0.05 + dy);
        g.lineTo(side * 0.23, 0.03 + dy * 1.4);
        g.stroke();
      });
    });
    g.restore();

    if (o.tint) {
      g.fillStyle = o.tint;
      g.beginPath(); g.ellipse(0, -0.06, 0.36, 0.44, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // ------------------------------------------------------------- Registry --
  const list = [
    {
      id: "turtle",
      speciesId: "green-sea-turtle",
      name: "Sea Turtle",
      species: "Green Sea Turtle",
      emoji: "🐢",
      blurb: "Steady and sure — a little of everything.",
      perkLabel: "Balanced",
      stats: { jump: 11.5, laneLerp: 13, hearts: 3, bodyScale: 1 },
      draw: drawTurtle
    },
    {
      id: "dolphin",
      speciesId: "bottlenose-dolphin",
      name: "Dolphin",
      species: "Bottlenose Dolphin",
      emoji: "🐬",
      blurb: "Powerful tail beat — leaps higher than anyone.",
      perkLabel: "Higher jump",
      stats: { jump: 13.6, laneLerp: 13, hearts: 3, bodyScale: 1.02 },
      draw: drawDolphin
    },
    {
      id: "manta",
      speciesId: "giant-manta-ray",
      name: "Manta Ray",
      species: "Giant Manta Ray",
      emoji: "🪽",
      blurb: "Huge wings that bank between lanes in an instant.",
      perkLabel: "Faster lane switch",
      stats: { jump: 11, laneLerp: 19.5, hearts: 3, bodyScale: 1.12 },
      draw: drawManta
    },
    {
      id: "otter",
      speciesId: "sea-otter",
      name: "Sea Otter",
      species: "Southern Sea Otter",
      emoji: "🦦",
      blurb: "Thick fur and quick wits — takes one extra hit.",
      perkLabel: "Extra life",
      stats: { jump: 10.6, laneLerp: 13.5, hearts: 4, bodyScale: 0.96 },
      draw: drawOtter
    }
  ];

  return list;
})();

const CHARACTER_BY_ID = {};
CHARACTERS.forEach(c => { CHARACTER_BY_ID[c.id] = c; });
const DEFAULT_CHARACTER_ID = "turtle";
