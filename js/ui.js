// ===================== ui.js =====================
// DOM screens, HUD, and the 3-stage learning flow (fact -> awareness -> quiz).

const UI = (() => {
  const $ = (id) => document.getElementById(id);
  const screens = {};
  const hud = {};
  let learning = null;
  let onLearningDone = null;
  let hintTimer = null;
  const BEST_KEY = "oceanGuardian.bestScore";

  const HEART_SVG = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20.6 10.5 19.3C5 14.3 1.4 11 1.4 7a5.6 5.6 0 0 1 5.7-5.6c1.8 0 3.6.9 4.9 2.3a6.5 6.5 0 0 1 4.9-2.3A5.6 5.6 0 0 1 22.6 7c0 4-3.6 7.3-9.1 12.3z"/></svg>';

  function cacheScreens() {
    document.querySelectorAll(".screen").forEach(el => { screens[el.id] = el; });
  }

  function focusFirst(container) {
    const target = container.querySelector("[data-autofocus]:not(.hidden)") ||
      container.querySelector("button:not([disabled]):not(.hidden)");
    if (target) setTimeout(() => target.focus({ preventScroll: true }), 40);
  }

  function showScreen(id) {
    Object.values(screens).forEach(el => el.classList.add("hidden"));
    if (id && screens[id]) {
      screens[id].classList.remove("hidden");
      if (id !== "screen-learning") focusFirst(screens[id]);
    }
  }

  function setHudVisible(v) { $("hud").classList.toggle("hidden", !v); }

  function announce(msg) { $("sr-live").textContent = msg; }

  // -------------------------------------------------------------- Best --
  function getBest() {
    try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* storage unavailable */ }
  }

  // --------------------------------------------------------------- HUD --
  function buildHud() {
    const hearts = $("hud-hearts");
    hearts.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const s = document.createElement("span");
      s.className = "heart full";
      s.innerHTML = HEART_SVG;
      hearts.appendChild(s);
    }
    const icons = $("hud-disc-dots");
    icons.innerHTML = "";
    LEARNING_MODULES.forEach(m => {
      const img = document.createElement("img");
      img.className = "disc-icon";
      img.alt = "";
      img.src = Sprites.url(m.obstacleType);
      img.dataset.id = m.id;
      icons.appendChild(img);
    });
  }

  function resetHUD() {
    Object.keys(hud).forEach(k => delete hud[k]);
  }

  function updateHUD(s) {
    if (hud.hearts !== s.hearts) {
      const prev = hud.hearts;
      hud.hearts = s.hearts;
      [...$("hud-hearts").children].forEach((el, i) => {
        el.classList.toggle("full", i < s.hearts);
        el.classList.toggle("empty", i >= s.hearts);
        if (prev !== undefined && s.hearts < prev && i === s.hearts) {
          el.classList.remove("lost");
          void el.offsetWidth;
          el.classList.add("lost");
        }
      });
      $("hud-hearts").setAttribute("aria-label", `${s.hearts} of ${s.maxHearts} lives`);
    }

    const score = Math.floor(s.score);
    if (hud.score !== score) {
      const el = $("hud-score");
      if (hud.score !== undefined && score - hud.score >= 10) {
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
      }
      hud.score = score;
      el.textContent = score.toLocaleString();
    }

    const meters = Math.floor(s.meters);
    if (hud.meters !== meters) { hud.meters = meters; $("hud-distance").textContent = meters.toLocaleString(); }

    const disc = s.discoveries.size;
    if (hud.disc !== disc) {
      hud.disc = disc;
      $("hud-discoveries").textContent = disc;
      document.querySelectorAll(".disc-icon").forEach(img => img.classList.toggle("found", s.discoveries.has(img.dataset.id)));
    }

    const sp = Math.round(s.speedFactor * 100);
    if (hud.sp !== sp) { hud.sp = sp; $("hud-speed-bar").style.width = Math.max(4, sp) + "%"; }

    if (hud.shield !== s.shieldActive) { hud.shield = s.shieldActive; $("hud-shield").hidden = !s.shieldActive; }
  }

  function showHint() {
    const el = $("swipe-hint");
    el.classList.remove("hidden", "play");
    void el.offsetWidth;
    el.classList.add("play");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.classList.add("hidden"), 4300);
  }

  function hideHint() {
    clearTimeout(hintTimer);
    $("swipe-hint").classList.add("hidden");
  }

  // ------------------------------------------------------- Learning flow
  function startLearning(module, callback) {
    learning = { module, qIndex: 0, correct: 0, answered: false };
    onLearningDone = callback;
    hideHint();
    showScreen("screen-learning");
    renderFact();
  }

  function setLearnStep(step) {
    document.querySelectorAll(".lp-step").forEach(el => {
      const s = Number(el.dataset.step);
      el.classList.toggle("active", s === step);
      el.classList.toggle("done", s < step);
      if (s === step) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
    });
    $("learn-count").textContent = `${step}/3`;
  }

  function showStage(id) {
    document.querySelectorAll(".learn-stage").forEach(el => el.classList.add("hidden"));
    const stage = $(id);
    stage.classList.remove("hidden");
    stage.style.animation = "none";
    void stage.offsetWidth;
    stage.style.animation = "";
    const panel = stage.closest(".panel");
    if (panel) panel.scrollTop = 0;
    focusFirst(stage);
  }

  function renderFact() {
    const m = learning.module;
    setLearnStep(1);
    $("learn-icon").src = Sprites.url(m.obstacleType);
    $("fact-title").textContent = m.factTitle;
    $("fact-text").textContent = m.fact;
    $("learn-live-title").textContent = m.factTitle;
    showStage("learn-fact");
    announce(`${m.factTitle}. ${m.fact}`);
  }

  function renderAwareness() {
    if (!learning) return;
    const m = learning.module;
    setLearnStep(2);
    $("awareness-title").textContent = m.awarenessTitle;
    const body = $("awareness-body");
    body.innerHTML = "";
    m.awarenessParagraphs.forEach(text => {
      const p = document.createElement("p");
      p.textContent = text;
      body.appendChild(p);
    });
    body.scrollTop = 0;
    showStage("learn-awareness");
    announce(m.awarenessTitle);
  }

  function renderQuiz() {
    if (!learning) return;
    setLearnStep(3);
    learning.answered = false;
    const q = learning.module.quiz[learning.qIndex];
    $("quiz-qcount").textContent = `Question ${learning.qIndex + 1} of 2`;
    $("quiz-question").textContent = q.question;
    const opts = $("quiz-options");
    opts.innerHTML = "";
    q.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      const letter = document.createElement("span");
      letter.className = "qo-letter";
      letter.textContent = String.fromCharCode(65 + i);
      const label = document.createElement("span");
      label.className = "qo-text";
      label.textContent = text;
      btn.append(letter, label);
      btn.addEventListener("click", () => selectAnswer(i));
      opts.appendChild(btn);
    });
    $("quiz-explanation").classList.add("hidden");
    const next = $("btn-quiz-next");
    next.classList.add("hidden");
    next.textContent = learning.qIndex === 0 ? "Next Question" : "See Results";
    showStage("learn-quiz");
    announce(`Question ${learning.qIndex + 1} of 2. ${q.question}`);
  }

  function selectAnswer(i) {
    if (!learning || learning.answered) return;
    learning.answered = true;
    const q = learning.module.quiz[learning.qIndex];
    const correct = i === q.correctAnswer;
    if (correct) { learning.correct++; AudioFx.correct(); } else { AudioFx.wrong(); }

    document.querySelectorAll(".quiz-option").forEach((el, idx) => {
      el.disabled = true;
      el.setAttribute("aria-disabled", "true");
      let markText = null;
      if (idx === q.correctAnswer) { el.classList.add("correct"); markText = "✓ Correct"; }
      else if (idx === i) { el.classList.add("incorrect"); markText = "✗ Your pick"; }
      else el.classList.add("dimmed");
      if (markText) {
        const mark = document.createElement("span");
        mark.className = "qo-mark";
        mark.textContent = markText;
        el.appendChild(mark);
      }
    });

    const expl = $("quiz-explanation");
    expl.innerHTML = "";
    const head = document.createElement("strong");
    head.textContent = correct ? "Great job! " : "Good try! ";
    expl.append(head, document.createTextNode(q.explanation));
    expl.classList.remove("hidden", "expl-correct", "expl-incorrect");
    expl.classList.add(correct ? "expl-correct" : "expl-incorrect");

    const next = $("btn-quiz-next");
    next.classList.remove("hidden");
    setTimeout(() => next.focus({ preventScroll: true }), 40);
    next.scrollIntoView({ block: "nearest", behavior: Renderer.isReducedMotion() ? "auto" : "smooth" });
  }

  function nextQuizStep() {
    if (!learning) return;
    if (learning.qIndex === 0) {
      learning.qIndex = 1;
      renderQuiz();
    } else {
      renderResult();
    }
  }

  function renderResult() {
    const n = learning.correct;
    $("quiz-score-text").textContent = `Quiz Score: ${n}/2`;
    document.querySelectorAll("#quiz-stars .star").forEach((s, i) => {
      s.classList.remove("on");
      void s.offsetWidth;
      s.classList.toggle("on", i < n);
    });
    AudioFx.win();
    showStage("learn-result");
    announce(`Discovery complete. Quiz score ${n} out of 2. Ocean knowledge increased.`);
  }

  function completeLearning() {
    if (!learning) return;
    const result = { moduleId: learning.module.id, correctCount: learning.correct };
    const cb = onLearningDone;
    learning = null;
    onLearningDone = null;
    showScreen(null);
    if (cb) cb(result);
  }

  // --------------------------------------------------------- End screens
  function fillEndScreen(prefix, s) {
    const score = Math.floor(s.score);
    $(`${prefix}-score`).textContent = score.toLocaleString();
    $(`${prefix}-distance`).textContent = `${Math.floor(s.meters).toLocaleString()}m`;
    $(`${prefix}-discoveries`).textContent = `${s.discoveries.size}/6`;
    const acc = s.quizTotal > 0 ? Math.round((s.quizCorrect / s.quizTotal) * 100) : 0;
    $(`${prefix}-quiz`).textContent = s.quizTotal > 0 ? `${s.quizCorrect}/${s.quizTotal} (${acc}%)` : "—";
    $(`${prefix}-tokens`).textContent = s.tokens;
    const best = getBest();
    const isBest = score > best;
    if (isBest) { saveBest(score); $("best-score").textContent = score.toLocaleString(); }
    $(`${prefix}-newbest`).classList.toggle("hidden", !isBest);
  }

  // ----------------------------------------------------------------- Init
  function init() {
    cacheScreens();
    buildHud();
    const turtleImg = Renderer.turtleBadgeURL(256);
    $("start-turtle").src = turtleImg;
    $("awareness-img").src = turtleImg;
    $("result-img").src = Sprites.url("goldenShell");
    $("win-img").src = turtleImg;
    $("best-score").textContent = getBest().toLocaleString();

    $("btn-fact-next").addEventListener("click", () => { AudioFx.ui(); renderAwareness(); });
    $("btn-awareness-next").addEventListener("click", () => { AudioFx.ui(); renderQuiz(); });
    $("btn-quiz-next").addEventListener("click", () => { AudioFx.ui(); nextQuizStep(); });
    $("btn-continue-swimming").addEventListener("click", () => { AudioFx.ui(); completeLearning(); });
    document.querySelectorAll("[data-close-info]").forEach(btn => {
      btn.addEventListener("click", () => { AudioFx.ui(); showScreen("screen-start"); });
    });
  }

  return {
    init, showScreen, setHudVisible, updateHUD, resetHUD, showHint, hideHint,
    startLearning, fillEndScreen, announce
  };
})();
