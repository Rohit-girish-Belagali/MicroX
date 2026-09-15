// ===================== input.js =====================
// Keyboard + swipe (touch or mouse-drag) normalized into intents:
// "left" | "right" | "jump" | "dive" | "pause".

const Input = (() => {
  const listeners = [];
  let active = false; // true only while gameplay is running

  function emit(intent) { listeners.forEach(fn => fn(intent)); }

  const keyMap = {
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
    ArrowUp: "jump", w: "jump", W: "jump", " ": "jump",
    ArrowDown: "dive", s: "dive", S: "dive",
    p: "pause", P: "pause", Escape: "pause"
  };

  window.addEventListener("keydown", (e) => {
    const intent = keyMap[e.key];
    if (!intent) return;
    if (intent === "pause") {
      if (!e.repeat) emit("pause");
      return;
    }
    // When menus/modals are open, leave arrows/Space to native button behaviour.
    if (!active) return;
    e.preventDefault();
    if (e.repeat) return;
    emit(intent);
  });

  function swipeThreshold() {
    return Math.max(22, Math.min(window.innerWidth, window.innerHeight) * 0.05);
  }

  function attachSwipe(el) {
    let sx = 0, sy = 0, tracking = false;

    const start = (x, y) => { sx = x; sy = y; tracking = true; };
    const move = (x, y) => {
      if (!tracking) return;
      const dx = x - sx, dy = y - sy;
      const th = swipeThreshold();
      if (Math.abs(dx) < th && Math.abs(dy) < th) return;
      tracking = false; // one action per gesture, fired as soon as it's recognised
      if (Math.abs(dx) > Math.abs(dy)) emit(dx > 0 ? "right" : "left");
      else emit(dy < 0 ? "jump" : "dive");
    };

    el.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      start(t.clientX, t.clientY);
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
      if (active) e.preventDefault();
      const t = e.changedTouches[0];
      move(t.clientX, t.clientY);
    }, { passive: false });
    el.addEventListener("touchend", () => { tracking = false; }, { passive: true });

    el.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") start(e.clientX, e.clientY); });
    el.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") move(e.clientX, e.clientY); });
    window.addEventListener("pointerup", (e) => { if (e.pointerType === "mouse") tracking = false; });
  }

  return {
    init(el) { attachSwipe(el); },
    onIntent(fn) { listeners.push(fn); },
    setActive(v) { active = v; }
  };
})();
