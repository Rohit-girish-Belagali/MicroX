// ===================== game.js =====================
// State machine + main loop. Ties input, entities, renderer and UI together.

const Game = (() => {
  const S = {
    START: "START_SCREEN",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    COLLISION: "POLLUTION_COLLISION",
    LEARNING: "LEARNING", // ui.js walks LEARNING_FACT -> AWARENESS -> QUIZ_Q1 -> QUIZ_Q2 -> QUIZ_RESULT
    GAME_OVER: "GAME_OVER",
    WIN: "WIN_SCREEN"
  };

  const BASE_SPEED = 13;
  const MAX_SPEED = 42;
  const WARMUP_METERS = 150;   // settle-in period before the ramp starts
  const RAMP_METERS = 2350;    // top speed reached just before the finish
  const METERS_PER_UNIT = 0.5;
  const WIN_METERS = 2500;
  const HIT_Z = 0.55, HIT_X = 0.6;
  const PICK_Z = 0.8, PICK_X = 0.7;
  const GRACE_AFTER_LEARNING = 1.4;
  const ATTRACT_SPEED = 9;

  let canvas, ctx;
  let state = S.START;
  let lastTime = 0;
  let character = CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
  let turtle = new Player(character);
  let spawner = new Spawner();
  let objects = [];
  let world = freshWorld();
  let prevDistance = 0;
  let collisionTimer = 0;
  let pendingModule = null;
  let pendingSpecies = null;

  function freshWorld() {
    const hearts = character.stats.hearts;
    return {
      hearts, maxHearts: hearts,
      score: 0, distance: 0, meters: 0,
      speed: BASE_SPEED, speedFactor: 0,
      discoveries: new Set(),
      species: new Set(),          // species rescued this run
      shieldActive: false,
      quizCorrect: 0, quizTotal: 0,
      tokens: 0
    };
  }

  function strokeRate(speed) { return 5 + speed * 0.17; }

  // ------------------------------------------------------------- Canvas --
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Renderer.resize(w, h, dpr);
  }

  // -------------------------------------------------------------- States --
  function goTo(next) {
    state = next;
    document.body.dataset.state = next;
    Input.setActive(next === S.PLAYING);
  }

  function startGame(charId) {
    character = CHARACTER_BY_ID[charId] || character;
    UI.rememberCharacter(character.id);
    // playing as a species counts as having met it
    UI.unlockSpecies(character.speciesId);
    turtle = new Player(character);
    spawner = new Spawner(id => UI.isSpeciesKnown(id));
    objects = [];
    world = freshWorld();
    world.species.add(character.speciesId);
    prevDistance = 0;
    pendingModule = null;
    pendingSpecies = null;
    AudioFx.unlock();
    UI.resetHUD();
    UI.updateHUD(world);
    UI.setHudVisible(true);
    UI.showScreen(null);
    UI.showHint();
    goTo(S.PLAYING);
  }

  function togglePause() {
    if (state === S.PLAYING) {
      goTo(S.PAUSED);
      UI.showScreen("screen-pause");
    } else if (state === S.PAUSED) {
      UI.showScreen(null);
      goTo(S.PLAYING);
    }
  }

  function finish(result) {
    goTo(result);
    UI.hideHint();
    if (result === S.WIN) {
      UI.fillEndScreen("win", world);
      UI.showScreen("screen-win");
      AudioFx.win();
    } else {
      UI.fillEndScreen("go", world);
      UI.showScreen("screen-gameover");
    }
  }

  // --------------------------------------------------------------- Input --
  function handleIntent(intent) {
    if (state === S.PLAYING) {
      switch (intent) {
        case "left": turtle.moveLeft() ? AudioFx.swish() : AudioFx.bump(); break;
        case "right": turtle.moveRight() ? AudioFx.swish() : AudioFx.bump(); break;
        case "jump": if (turtle.jump()) AudioFx.jump(); break;
        case "dive": turtle.dive(); break;
        case "pause": togglePause(); break;
      }
    } else if (state === S.PAUSED && intent === "pause") {
      togglePause();
    }
  }

  // ----------------------------------------------------------- Collisions
  function checkCollisions() {
    for (const o of objects) {
      if (!o.alive) continue;
      const z = o.worldZ - world.distance;
      const pz = o.worldZ - prevDistance;
      const dx = Math.abs(turtle.x - o.laneX);

      if (o.kind === "obstacle") {
        if (o.cleared || turtle.invulnT > 0) continue;
        // swept test so fast speeds can't tunnel through an obstacle between frames
        if (!(pz >= -HIT_Z && z <= HIT_Z) || dx > HIT_X) continue;
        if (turtle.y >= OBSTACLE_SPECS[o.subtype].height) { o.cleared = true; continue; }
        hitObstacle(o);
        return;
      }

      if (!(pz >= -PICK_Z && z <= PICK_Z) || dx > PICK_X) continue;
      if (Math.abs(o.y - (turtle.y + 0.45)) > 0.95) continue;
      collect(o);
    }
  }

  function collect(o) {
    o.alive = false;
    const cfg = COLLECTIBLE_TYPES[o.subtype];
    world.score += cfg.points;
    turtle.collectT = 0.35;
    const z = Math.max(0.3, o.worldZ - world.distance);

    if (cfg.kind === "species") {
      collectSpecies(o, z);
      return;
    }

    if (cfg.kind === "shield") {
      world.shieldActive = true;
      Renderer.burstWorld(o.laneX, o.y, z, ["#8ff6ff", "#ff9be8", "#ffffff"], 18);
      Renderer.floatText("SHIELD!", o.laneX, o.y + 0.8, z, "#8ff6ff");
      AudioFx.shield();
    } else if (cfg.kind === "token") {
      world.tokens++;
      Renderer.burstWorld(o.laneX, o.y, z, ["#7dffb0", "#ffffff", "#ffd23f"], 18);
      Renderer.floatText(`+${cfg.points}`, o.laneX, o.y + 0.8, z, "#7dffb0");
      AudioFx.bonus();
    } else if (cfg.kind === "bonus") {
      Renderer.burstWorld(o.laneX, o.y, z, ["#ffd23f", "#fff6b0", "#ff9f1c"], 18);
      Renderer.floatText(`+${cfg.points}`, o.laneX, o.y + 0.8, z, "#ffd23f");
      AudioFx.bonus();
    } else {
      Renderer.burstWorld(o.laneX, o.y, z, ["#fff3a0", "#9ff3ff"], 8);
      Renderer.floatText(`+${cfg.points}`, o.laneX, o.y + 0.7, z, "#ffffff");
      AudioFx.collect();
    }
  }

  // A rescue interrupts the run only the first time a species is met; after
  // that it is a toast so the flow is not broken every few hundred metres.
  function collectSpecies(o, z) {
    const species = SPECIES_BY_ID[o.speciesId];
    if (!species) return;
    const firstEver = !UI.isSpeciesKnown(species.id);
    world.species.add(species.id);

    Renderer.burstWorld(o.laneX, o.y, z, ["#7dffd0", "#ffffff", "#8ff6ff"], 22);
    Renderer.floatText("RESCUED!", o.laneX, o.y + 0.9, z, "#7dffd0");
    AudioFx.bonus();

    if (firstEver) {
      pendingSpecies = species;
      collisionTimer = 0.55;
      UI.updateHUD(world);
      goTo(S.COLLISION);
    } else {
      UI.showSpeciesToast(species);
    }
  }

  function hitObstacle(o) {
    o.alive = false;
    const shielded = world.shieldActive;
    if (shielded) world.shieldActive = false;
    else world.hearts = Math.max(0, world.hearts - 1);

    turtle.hitT = 0.6;
    turtle.vy = Math.min(turtle.vy, 0);
    Renderer.burstWorld(o.laneX, 0.6, 0.5, shielded ? ["#8ff6ff", "#ffffff"] : ["#ff5c5c", "#ffb35c", "#ffffff"], 26);
    Renderer.floatText(shielded ? "SHIELD SAVED YOU!" : "OUCH!", turtle.x, 1.9, 0.4, shielded ? "#8ff6ff" : "#ff8a8a");
    Renderer.shake(18, 0.4);
    Renderer.flash(shielded ? "120,230,255" : "255,40,60", 0.55);
    AudioFx.hit();
    // Chrome logs an error if vibrate() runs before any user gesture on the page.
    const activated = navigator.userActivation ? navigator.userActivation.hasBeenActive : true;
    if (navigator.vibrate && activated) { try { navigator.vibrate(120); } catch (e) { /* unsupported */ } }

    pendingModule = MODULE_BY_OBSTACLE_TYPE[o.subtype];
    collisionTimer = 0.7;
    UI.updateHUD(world);
    goTo(S.COLLISION);
  }

  function enterLearning() {
    goTo(S.LEARNING);
    if (pendingSpecies) {
      const sp = pendingSpecies;
      pendingSpecies = null;
      UI.startSpotlight(sp, onSpotlightComplete);
    } else {
      const mod = pendingModule;
      pendingModule = null;
      UI.startLearning(mod, onLearningComplete);
    }
  }

  function resume() {
    if (world.hearts <= 0) { finish(S.GAME_OVER); return; }
    if (world.discoveries.size >= LEARNING_MODULES.length) { finish(S.WIN); return; }

    turtle.invulnT = GRACE_AFTER_LEARNING;
    UI.resetHUD();
    UI.updateHUD(world);
    goTo(S.PLAYING);
  }

  function onLearningComplete(result) {
    world.discoveries.add(result.moduleId);
    world.quizCorrect += result.correctCount;
    world.quizTotal += result.questionCount;
    resume();
  }

  function onSpotlightComplete(result) {
    UI.unlockSpecies(result.speciesId);
    world.quizCorrect += result.correctCount;
    world.quizTotal += result.questionCount;
    resume();
  }

  // ---------------------------------------------------------------- Loop
  function update(dt) {
    switch (state) {
      case S.PLAYING: {
        prevDistance = world.distance;
        world.distance += world.speed * dt;
        world.meters = world.distance * METERS_PER_UNIT;
        world.score += world.speed * dt * 0.25;

        // Steady, predictable climb across the whole run: flat while the player
        // settles in, then near-linear so top speed arrives near the finish.
        const t = clamp((world.meters - WARMUP_METERS) / (RAMP_METERS - WARMUP_METERS), 0, 1);
        world.speedFactor = t * (0.7 + 0.3 * t);
        world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * world.speedFactor;

        turtle.update(dt, strokeRate(world.speed));
        spawner.update(world.distance, world.speedFactor, objects);
        checkCollisions();
        objects = objects.filter(o => o.alive && o.worldZ - world.distance > -4);
        Renderer.update(dt, world.speed);

        if (state === S.PLAYING && world.meters >= WIN_METERS) finish(S.WIN);
        break;
      }
      case S.COLLISION:
        collisionTimer -= dt;
        turtle.idle(dt, 3);
        Renderer.update(dt, 0);
        if (collisionTimer <= 0) enterLearning();
        break;
      case S.START:
        world.distance += ATTRACT_SPEED * dt;
        turtle.idle(dt, strokeRate(ATTRACT_SPEED));
        Renderer.update(dt, ATTRACT_SPEED);
        break;
      default:
        turtle.idle(dt, 2.2);
        Renderer.update(dt, 0);
    }
  }

  function frameSpeed() {
    if (state === S.PLAYING) return world.speed;
    if (state === S.START) return ATTRACT_SPEED;
    return 0;
  }

  function loop(ts) {
    const dt = Math.min(0.05, Math.max(0, (ts - lastTime) / 1000));
    lastTime = ts;
    update(dt);
    Renderer.draw({
      distance: world.distance,
      speed: frameSpeed(),
      turtle,
      objects,
      playing: state === S.PLAYING,
      shieldActive: world.shieldActive
    });
    if (state === S.PLAYING) UI.updateHUD(world);
    requestAnimationFrame(loop);
  }

  // ------------------------------------------------------------- Wiring --
  function bindButtons() {
    const on = (id, fn) => document.getElementById(id).addEventListener("click", () => { AudioFx.ui(); fn(); });
    on("btn-play", () => UI.openCharacterSelect());
    on("btn-start-run", () => startGame(UI.selectedCharacter()));
    on("btn-how", () => UI.showScreen("screen-how"));
    on("btn-about", () => UI.showScreen("screen-about"));
    on("btn-pause", togglePause);
    on("btn-resume", togglePause);
    // replaying keeps the character you are already swimming as
    on("btn-restart-from-pause", () => startGame(character.id));
    on("btn-restart", () => startGame(character.id));
    on("btn-play-again", () => startGame(character.id));
    on("btn-change-character", () => UI.openCharacterSelect());

    // the Codex is reachable from every screen that stands still
    ["btn-codex", "btn-codex-pause", "btn-codex-go", "btn-codex-win"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", () => { AudioFx.ui(); UI.openCodex(); });
    });
  }

  function init() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    Sprites.init();
    Renderer.init(ctx);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 150));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state === S.PLAYING) togglePause();
    });

    UI.init();
    Input.init(canvas);
    Input.onIntent(handleIntent);
    bindButtons();

    goTo(S.START);
    UI.setHudVisible(false);
    UI.showScreen("screen-start");

    requestAnimationFrame((ts) => { lastTime = ts; requestAnimationFrame(loop); });
  }

  return { init };
})();

window.addEventListener("DOMContentLoaded", () => Game.init());
