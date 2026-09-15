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

  const BASE_SPEED = 15;
  const MAX_SPEED = 46;
  const SPEED_RAMP = 1700;
  const METERS_PER_UNIT = 0.5;
  const WIN_METERS = 2500;
  const HIT_Z = 0.55, HIT_X = 0.6;
  const PICK_Z = 0.8, PICK_X = 0.7;
  const GRACE_AFTER_LEARNING = 1.4;
  const ATTRACT_SPEED = 9;

  let canvas, ctx;
  let state = S.START;
  let lastTime = 0;
  let turtle = new Turtle();
  let spawner = new Spawner();
  let objects = [];
  let world = freshWorld();
  let prevDistance = 0;
  let collisionTimer = 0;
  let pendingModule = null;

  function freshWorld() {
    return {
      hearts: 3, maxHearts: 3,
      score: 0, distance: 0, meters: 0,
      speed: BASE_SPEED, speedFactor: 0,
      discoveries: new Set(),
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

  function startGame() {
    turtle = new Turtle();
    spawner = new Spawner();
    objects = [];
    world = freshWorld();
    prevDistance = 0;
    pendingModule = null;
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
    UI.startLearning(pendingModule, onLearningComplete);
    pendingModule = null;
  }

  function onLearningComplete(result) {
    world.discoveries.add(result.moduleId);
    world.quizCorrect += result.correctCount;
    world.quizTotal += 2;

    if (world.hearts <= 0) { finish(S.GAME_OVER); return; }
    if (world.discoveries.size >= LEARNING_MODULES.length) { finish(S.WIN); return; }

    turtle.invulnT = GRACE_AFTER_LEARNING;
    UI.resetHUD();
    UI.updateHUD(world);
    goTo(S.PLAYING);
  }

  // ---------------------------------------------------------------- Loop
  function update(dt) {
    switch (state) {
      case S.PLAYING: {
        world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * (1 - Math.exp(-world.distance / SPEED_RAMP));
        world.speedFactor = (world.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
        prevDistance = world.distance;
        world.distance += world.speed * dt;
        world.meters = world.distance * METERS_PER_UNIT;
        world.score += world.speed * dt * 0.25;

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
    on("btn-play", startGame);
    on("btn-how", () => UI.showScreen("screen-how"));
    on("btn-about", () => UI.showScreen("screen-about"));
    on("btn-pause", togglePause);
    on("btn-resume", togglePause);
    on("btn-restart-from-pause", startGame);
    on("btn-restart", startGame);
    on("btn-play-again", startGame);
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
