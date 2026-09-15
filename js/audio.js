// ===================== audio.js =====================
// Tiny procedural WebAudio helper — no external sound files, so nothing to
// license and nothing to download. Fails silently if WebAudio is unavailable.

const AudioFx = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function beep({ freq = 440, duration = 0.12, type = "sine", gain = 0.08, sweepTo = null }) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, c.currentTime + duration);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration + 0.02);
  }

  return {
    setEnabled(v) { enabled = v; },
    unlock() { getCtx(); },
    collect() { beep({ freq: 660, sweepTo: 990, duration: 0.1, type: "triangle", gain: 0.07 }); },
    bonus() { beep({ freq: 520, sweepTo: 1200, duration: 0.18, type: "triangle", gain: 0.09 }); },
    hit() { beep({ freq: 180, sweepTo: 60, duration: 0.25, type: "sawtooth", gain: 0.1 }); },
    correct() { beep({ freq: 700, sweepTo: 1100, duration: 0.15, type: "sine", gain: 0.08 }); },
    wrong() { beep({ freq: 220, sweepTo: 140, duration: 0.2, type: "square", gain: 0.06 }); },
    shield() { beep({ freq: 400, sweepTo: 800, duration: 0.2, type: "sine", gain: 0.07 }); },
    jump() { beep({ freq: 300, sweepTo: 720, duration: 0.16, type: "sine", gain: 0.06 }); },
    swish() { beep({ freq: 900, sweepTo: 500, duration: 0.07, type: "triangle", gain: 0.035 }); },
    bump() { beep({ freq: 140, sweepTo: 110, duration: 0.08, type: "square", gain: 0.04 }); },
    win() { [0, 0.12, 0.24].forEach((t, i) => setTimeout(() => beep({ freq: 520 + i * 180, duration: 0.18, type: "triangle", gain: 0.08 }), t * 1000)); },
    ui() { beep({ freq: 500, duration: 0.06, type: "sine", gain: 0.05 }); }
  };
})();
