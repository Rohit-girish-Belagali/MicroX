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
  const CODEX_KEY = "oceanGuardian.codex";
  const CHAR_KEY = "oceanGuardian.character";
  let knownSpecies = new Set();
  let chosenCharacter = DEFAULT_CHARACTER_ID;
  let toastTimer = null;
  let currentScreen = null;
  let returnScreen = "screen-start";

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
    currentScreen = id || null;
    if (id && screens[id]) {
      screens[id].classList.remove("hidden");
      if (id !== "screen-learning") focusFirst(screens[id]);
    }
  }

  // Remember where an overlay was opened from, so Back goes there and not
  // always to the start screen (the Codex opens from pause and end screens too).
  function pushScreen(id) {
    if (currentScreen && currentScreen !== id) returnScreen = currentScreen;
    showScreen(id);
  }

  function goBack() { showScreen(returnScreen || "screen-start"); }

  function setHudVisible(v) { $("hud").classList.toggle("hidden", !v); }

  function announce(msg) { $("sr-live").textContent = msg; }

  // -------------------------------------------------------------- Best --
  function getBest() {
    try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* storage unavailable */ }
  }

  // ------------------------------------------------------------- Codex --
  function loadCodex() {
    let ids = [];
    try {
      const raw = localStorage.getItem(CODEX_KEY);
      if (raw) ids = JSON.parse(raw);
    } catch (e) { ids = []; }
    knownSpecies = new Set(Array.isArray(ids) ? ids.filter(id => SPECIES_BY_ID[id]) : []);
  }

  function saveCodex() {
    try { localStorage.setItem(CODEX_KEY, JSON.stringify([...knownSpecies])); } catch (e) { /* storage unavailable */ }
  }

  function isSpeciesKnown(id) { return knownSpecies.has(id); }

  function unlockSpecies(id) {
    if (!id || !SPECIES_BY_ID[id] || knownSpecies.has(id)) return;
    knownSpecies.add(id);
    saveCodex();
  }

  function loadCharacter() {
    try {
      const id = localStorage.getItem(CHAR_KEY);
      if (id && CHARACTER_BY_ID[id]) chosenCharacter = id;
    } catch (e) { /* storage unavailable */ }
  }

  function rememberCharacter(id) {
    if (!CHARACTER_BY_ID[id]) return;
    chosenCharacter = id;
    try { localStorage.setItem(CHAR_KEY, id); } catch (e) { /* storage unavailable */ }
  }

  // --------------------------------------------------------------- HUD --
  function buildHud() {
    const hearts = $("hud-hearts");
    hearts.innerHTML = "";
    const maxHearts = Math.max(...CHARACTERS.map(c => c.stats.hearts));
    for (let i = 0; i < maxHearts; i++) {
      const s = document.createElement("span");
      s.className = "heart full";
      s.innerHTML = HEART_SVG;
      hearts.appendChild(s);
    }
    $("hud-disc-total").textContent = LEARNING_MODULES.length;
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
    if (hud.hearts !== s.hearts || hud.maxHearts !== s.maxHearts) {
      const prev = hud.hearts;
      hud.hearts = s.hearts;
      hud.maxHearts = s.maxHearts;
      // the row is built for the roomiest character, so hide the surplus
      [...$("hud-hearts").children].forEach((el, i) => {
        el.hidden = i >= s.maxHearts;
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
    hideToast();
  }

  // ------------------------------------------------------- Learning flow
  // One flow serves two lessons. A pollution module walks three stages
  // (fact -> awareness -> 2-question quiz); a species spotlight walks two
  // (species card -> 1 question). `learning.steps` drives the step pips.

  function startLearning(module, callback) {
    if (!module) { if (callback) callback({ moduleId: null, correctCount: 0, questionCount: 0 }); return; }
    learning = {
      mode: "module", module, steps: 3,
      questions: module.quiz, qIndex: 0, correct: 0, answered: false
    };
    onLearningDone = callback;
    hideHint();
    showScreen("screen-learning");
    renderFact();
  }

  function startSpotlight(species, callback) {
    if (!species) { if (callback) callback({ speciesId: null, correctCount: 0, questionCount: 0 }); return; }
    learning = {
      mode: "species", species, steps: 2,
      questions: [species.quiz], qIndex: 0, correct: 0, answered: false
    };
    onLearningDone = callback;
    hideHint();
    showScreen("screen-learning");
    renderSpecies();
  }

  // Step pips are shared, so relabel them for whichever lesson is running.
  const STEP_LABELS = {
    module: ["Fact", "Learn", "Quiz"],
    species: ["Species", "Quiz"]
  };

  function setLearnStep(step) {
    const total = learning ? learning.steps : 3;
    const labels = STEP_LABELS[learning ? learning.mode : "module"];
    document.querySelectorAll(".lp-step").forEach(el => {
      const s = Number(el.dataset.step);
      el.hidden = s > total;
      if (labels[s - 1]) el.querySelector(".lp-label").textContent = labels[s - 1];
      el.classList.toggle("active", s === step);
      el.classList.toggle("done", s < step);
      if (s === step) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
    });
    document.querySelectorAll(".lp-bar").forEach((el, i) => { el.hidden = i >= total - 1; });
    $("learn-count").textContent = `${step}/${total}`;
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

  function renderSpecies() {
    if (!learning) return;
    const sp = learning.species;
    setLearnStep(1);
    $("learn-icon").src = Sprites.url("rescuePod");
    $("species-emoji").textContent = sp.emoji;
    $("species-name").textContent = sp.name;
    $("species-sci").textContent = sp.scientificName;
    $("species-status").textContent = sp.status;
    $("species-status").className = "status-chip " + statusClass(sp.status);
    const rows = $("species-rows");
    rows.innerHTML = "";
    [["Group", sp.group], ["Habitat", sp.habitat], ["Diet", sp.diet], ["Size", sp.size]]
      .forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "sp-row";
        const k = document.createElement("span");
        k.className = "sp-key";
        k.textContent = label;
        const v = document.createElement("span");
        v.className = "sp-val";
        v.textContent = value;
        row.append(k, v);
        rows.appendChild(row);
      });
    const body = $("species-facts");
    body.innerHTML = "";
    sp.facts.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      body.appendChild(li);
    });
    $("species-help").textContent = sp.help;
    $("learn-live-title").textContent = `${sp.name} rescued`;
    showStage("learn-species");
    announce(`Species rescued: ${sp.name}. ${sp.facts[0]}`);
  }

  function statusClass(status) {
    const rank = STATUS_RANK[status];
    return rank === undefined ? "st-0" : "st-" + rank;
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
    const q = learning.questions[learning.qIndex];
    const total = learning.questions.length;
    $("quiz-qcount").textContent = `Question ${learning.qIndex + 1} of ${total}`;
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
    next.textContent = learning.qIndex < total - 1 ? "Next Question" : "See Results";
    showStage("learn-quiz");
    announce(`Question ${learning.qIndex + 1} of ${total}. ${q.question}`);
  }

  function selectAnswer(i) {
    if (!learning || learning.answered) return;
    learning.answered = true;
    const q = learning.questions[learning.qIndex];
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
    if (learning.qIndex < learning.questions.length - 1) {
      learning.qIndex++;
      renderQuiz();
    } else {
      renderResult();
    }
  }

  function renderResult() {
    const n = learning.correct;
    const total = learning.questions.length;
    const species = learning.mode === "species";
    $("result-title").textContent = species ? "SPECIES ADDED TO CODEX" : "DISCOVERY COMPLETE";
    $("result-sub").textContent = species
      ? `${learning.species.name} joins your Marine Life Codex.`
      : "Ocean knowledge increased.";
    $("result-img").src = Sprites.url(species ? "rescuePod" : "goldenShell");
    $("quiz-score-text").textContent = `Quiz Score: ${n}/${total}`;
    // one star per question, so a 1-question spotlight shows a single star
    const stars = document.querySelectorAll("#quiz-stars .star");
    stars.forEach((s, i) => {
      s.hidden = i >= total;
      s.classList.remove("on");
      void s.offsetWidth;
      s.classList.toggle("on", i < n);
    });
    AudioFx.win();
    showStage("learn-result");
    announce(`Complete. Quiz score ${n} out of ${total}.`);
  }

  function completeLearning() {
    if (!learning) return;
    const result = {
      moduleId: learning.mode === "module" ? learning.module.id : null,
      speciesId: learning.mode === "species" ? learning.species.id : null,
      correctCount: learning.correct,
      questionCount: learning.questions.length
    };
    const cb = onLearningDone;
    learning = null;
    onLearningDone = null;
    showScreen(null);
    if (cb) cb(result);
  }

  // --------------------------------------------------- Character select --
  function buildCharacterCards() {
    const grid = $("char-grid");
    grid.innerHTML = "";
    CHARACTERS.forEach(c => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "char-card";
      btn.dataset.id = c.id;
      btn.setAttribute("aria-pressed", "false");

      const art = document.createElement("img");
      art.className = "char-art";
      art.alt = "";
      art.src = Renderer.characterBadgeURL(c.id, 256);

      const name = document.createElement("h3");
      name.className = "char-name";
      name.textContent = c.name;

      const sci = document.createElement("p");
      sci.className = "char-species";
      sci.textContent = c.species;

      const perk = document.createElement("span");
      perk.className = "char-perk";
      perk.textContent = c.perkLabel;

      const blurb = document.createElement("p");
      blurb.className = "char-blurb";
      blurb.textContent = c.blurb;

      btn.append(art, name, sci, perk, blurb);
      btn.addEventListener("click", () => { AudioFx.ui(); selectCharacter(c.id); });
      grid.appendChild(btn);
    });
  }

  function selectCharacter(id) {
    if (!CHARACTER_BY_ID[id]) return;
    chosenCharacter = id;
    document.querySelectorAll(".char-card").forEach(el => {
      const on = el.dataset.id === id;
      el.classList.toggle("selected", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const c = CHARACTER_BY_ID[id];
    $("char-hearts").textContent = `${c.stats.hearts} lives`;
    announce(`${c.name} selected. ${c.perkLabel}.`);
  }

  function openCharacterSelect() {
    pushScreen("screen-select");
    selectCharacter(chosenCharacter);
  }

  function selectedCharacter() { return chosenCharacter; }

  // ------------------------------------------------------------- Codex --
  function buildCodexGrid() {
    const grid = $("codex-grid");
    grid.innerHTML = "";
    MARINE_SPECIES.forEach(sp => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "codex-card";
      btn.dataset.id = sp.id;

      const bubble = document.createElement("span");
      bubble.className = "codex-emoji";

      const name = document.createElement("span");
      name.className = "codex-name";

      const chip = document.createElement("span");
      chip.className = "status-chip";

      btn.append(bubble, name, chip);
      btn.addEventListener("click", () => {
        if (!isSpeciesKnown(sp.id)) return;
        AudioFx.ui();
        openCodexDetail(sp.id);
      });
      grid.appendChild(btn);
    });
  }

  function refreshCodexGrid() {
    document.querySelectorAll(".codex-card").forEach(el => {
      const sp = SPECIES_BY_ID[el.dataset.id];
      const known = isSpeciesKnown(sp.id);
      el.classList.toggle("locked", !known);
      el.disabled = !known;
      el.querySelector(".codex-emoji").textContent = known ? sp.emoji : "?";
      el.querySelector(".codex-name").textContent = known ? sp.name : "Not yet rescued";
      const chip = el.querySelector(".status-chip");
      chip.textContent = known ? sp.status : "Unknown";
      chip.className = "status-chip " + (known ? statusClass(sp.status) : "st-locked");
      el.setAttribute("aria-label", known
        ? `${sp.name}, ${sp.status}. Open details.`
        : `Undiscovered species. Rescue one to unlock.`);
    });
    $("codex-count").textContent = `${knownSpecies.size}/${MARINE_SPECIES.length}`;
    const pct = (knownSpecies.size / MARINE_SPECIES.length) * 100;
    $("codex-bar").style.width = Math.max(2, pct) + "%";
  }

  function openCodex() {
    refreshCodexGrid();
    $("codex-detail").classList.add("hidden");
    $("codex-list").classList.remove("hidden");
    pushScreen("screen-codex");
  }

  function openCodexDetail(id) {
    const sp = SPECIES_BY_ID[id];
    if (!sp) return;
    $("cd-emoji").textContent = sp.emoji;
    $("cd-name").textContent = sp.name;
    $("cd-sci").textContent = sp.scientificName;
    $("cd-status").textContent = sp.status;
    $("cd-status").className = "status-chip " + statusClass(sp.status);

    const rows = $("cd-rows");
    rows.innerHTML = "";
    [["Group", sp.group], ["Habitat", sp.habitat], ["Diet", sp.diet], ["Size", sp.size]]
      .forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "sp-row";
        const k = document.createElement("span");
        k.className = "sp-key";
        k.textContent = label;
        const v = document.createElement("span");
        v.className = "sp-val";
        v.textContent = value;
        row.append(k, v);
        rows.appendChild(row);
      });

    const facts = $("cd-facts");
    facts.innerHTML = "";
    sp.facts.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      facts.appendChild(li);
    });
    $("cd-help").textContent = sp.help;

    $("codex-list").classList.add("hidden");
    $("codex-detail").classList.remove("hidden");
    $("codex-detail").scrollTop = 0;
    focusFirst($("codex-detail"));
    announce(`${sp.name}. ${sp.status}. ${sp.facts[0]}`);
  }

  function closeCodexDetail() {
    $("codex-detail").classList.add("hidden");
    $("codex-list").classList.remove("hidden");
    focusFirst($("codex-list"));
  }

  // ------------------------------------------------------------- Toast --
  // Shown for a species the player already knows, so the run is not paused.
  function showSpeciesToast(sp) {
    const el = $("species-toast");
    $("toast-emoji").textContent = sp.emoji;
    $("toast-name").textContent = sp.name;
    $("toast-fact").textContent = sp.facts[Math.floor(Math.random() * sp.facts.length)];
    el.classList.remove("hidden", "play");
    void el.offsetWidth;
    el.classList.add("play");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 4200);
    announce(`${sp.name} rescued again.`);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    $("species-toast").classList.add("hidden");
  }

  // --------------------------------------------------------- End screens
  function fillEndScreen(prefix, s) {
    const score = Math.floor(s.score);
    $(`${prefix}-score`).textContent = score.toLocaleString();
    $(`${prefix}-distance`).textContent = `${Math.floor(s.meters).toLocaleString()}m`;
    $(`${prefix}-discoveries`).textContent = `${s.discoveries.size}/${LEARNING_MODULES.length}`;
    $(`${prefix}-species`).textContent = `${s.species.size}/${MARINE_SPECIES.length}`;
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
    loadCodex();
    loadCharacter();
    buildHud();
    buildCharacterCards();
    buildCodexGrid();
    selectCharacter(chosenCharacter);
    const turtleImg = Renderer.turtleBadgeURL(256);
    $("start-turtle").src = turtleImg;
    $("awareness-img").src = turtleImg;
    $("result-img").src = Sprites.url("goldenShell");
    $("win-img").src = turtleImg;
    $("best-score").textContent = getBest().toLocaleString();

    $("btn-fact-next").addEventListener("click", () => { AudioFx.ui(); renderAwareness(); });
    $("btn-species-next").addEventListener("click", () => { AudioFx.ui(); renderQuiz(); });
    $("btn-codex-back").addEventListener("click", () => { AudioFx.ui(); closeCodexDetail(); });
    $("btn-awareness-next").addEventListener("click", () => { AudioFx.ui(); renderQuiz(); });
    $("btn-quiz-next").addEventListener("click", () => { AudioFx.ui(); nextQuizStep(); });
    $("btn-continue-swimming").addEventListener("click", () => { AudioFx.ui(); completeLearning(); });
    document.querySelectorAll("[data-close-info]").forEach(btn => {
      btn.addEventListener("click", () => { AudioFx.ui(); goBack(); });
    });
  }

  return {
    init, showScreen: pushScreen, setHudVisible, updateHUD, resetHUD, showHint, hideHint,
    startLearning, startSpotlight, fillEndScreen, announce,
    openCharacterSelect, selectedCharacter, rememberCharacter,
    openCodex, isSpeciesKnown, unlockSpecies, showSpeciesToast, hideToast
  };
})();
