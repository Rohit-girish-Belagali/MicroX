// ===================== cloud.js =====================
// Name-only cloud saves: the player types a name, and their best scores,
// rescued species and completed lessons are stored against an anonymous
// Supabase session. No email, no password, nothing for a student to forget.
//
// Behind the scenes signInAnonymously() mints a real auth user, so
// row-level security still applies and a player can only ever touch their own
// row. The session token lives in this browser's localStorage, which is what
// makes progress persist across visits.
//
// The game is fully playable without any of this. If the CDN is blocked, the
// project is unreachable, or anonymous sign-ins are switched off, every call
// below degrades to a no-op and localStorage keeps the progress locally.
//
// The key is the PUBLISHABLE (anon) key, meant to ship in the browser. Never
// put a service-role key or any account password in this file.

const Cloud = (() => {
  const SUPABASE_URL = "https://wpxtpebatlaptbcvkswu.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nhWOzlXjdn0A3XIe3YSjig_nImY8jCE";
  const TABLE = "player_saves";
  const NAME_KEY = "oceanGuardian.playerName";

  let client = null;      // supabase-js client, once the CDN module lands
  let session = null;     // anonymous auth session, null when not started
  let save = null;        // this player's row, mirrored locally
  let ready = false;      // true once we've tried to load the SDK
  let offline = false;    // true when the cloud is unreachable
  const listeners = [];

  function notify() {
    listeners.forEach(fn => {
      try { fn(save); } catch (e) { /* a broken listener must not break the game */ }
    });
  }

  // The name is also kept locally so the HUD and menus can show it instantly
  // on the next visit, before the network round-trip finishes.
  function localName() {
    try { return localStorage.getItem(NAME_KEY) || ""; } catch (e) { return ""; }
  }
  function rememberName(name) {
    try { localStorage.setItem(NAME_KEY, name); } catch (e) { /* storage blocked */ }
  }

  // ------------------------------------------------------------ Bootstrap --
  // Dynamic import, so a blocked CDN degrades to offline play rather than a
  // blank page. Safe to call more than once.
  async function init() {
    if (ready) return !!client;
    ready = true;
    try {
      const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
      client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

      // Reuse the session from a previous visit if there is one.
      const { data } = await client.auth.getSession();
      session = data.session || null;
      if (session) await pull();
      notify();
      return true;
    } catch (e) {
      console.warn("[cloud] playing offline:", e.message);
      offline = true;
      client = null;
      notify();
      return false;
    }
  }

  // --------------------------------------------------------------- Player --
  // Called when the player enters (or changes) their name. Creates the
  // anonymous session on first use, then writes the name onto their row.
  async function setName(name) {
    const clean = String(name || "").trim().slice(0, 24);
    if (!clean) return { error: "Please enter a name." };
    rememberName(clean);

    if (!client) {
      // Offline: the name still shows in-game, it just isn't synced anywhere.
      return { ok: true, offline: true };
    }

    try {
      if (!session) {
        const { data, error } = await client.auth.signInAnonymously();
        if (error) throw error;
        session = data.session;
      }
      await pull();
      const { data, error } = await client
        .from(TABLE)
        .update({ display_name: clean })
        .eq("user_id", session.user.id)
        .select()
        .single();
      if (error) throw error;
      save = data;
      notify();
      return { ok: true };
    } catch (e) {
      // Most likely cause: anonymous sign-ins are disabled for the project.
      console.warn("[cloud] could not start a cloud save:", e.message);
      offline = true;
      return { ok: true, offline: true };
    }
  }

  function playerName() { return (save && save.display_name) || localName(); }
  function hasName() { return !!playerName(); }
  function isOffline() { return offline || !client; }
  function currentSave() { return save; }

  // ----------------------------------------------------------- Read/write --
  // Fetch this player's row, creating it if the signup trigger has not.
  async function pull() {
    if (!client || !session) return null;
    try {
      const { data, error } = await client
        .from(TABLE).select("*").eq("user_id", session.user.id).maybeSingle();
      if (error) throw error;
      if (data) { save = data; return save; }

      const ins = await client.from(TABLE)
        .insert({ user_id: session.user.id, display_name: localName() || null })
        .select().single();
      save = ins.data || null;
      return save;
    } catch (e) {
      console.warn("[cloud] could not load save:", e.message);
      return null;
    }
  }

  // Merge one finished run into the stored save and push it back. Totals
  // accumulate, bests take the max, and the learning sets union, so nothing
  // already earned can be lost by a bad run.
  async function recordRun(world, characterId) {
    if (!client || !session || !save) return null;

    const score = Math.floor(world.score);
    const meters = Math.floor(world.meters);
    const merged = {
      best_score: Math.max(save.best_score || 0, score),
      best_meters: Math.max(save.best_meters || 0, meters),
      runs_played: (save.runs_played || 0) + 1,
      total_meters: (save.total_meters || 0) + meters,
      total_score: (save.total_score || 0) + score,
      tokens_total: (save.tokens_total || 0) + (world.tokens || 0),
      discoveries: [...new Set([...(save.discoveries || []), ...world.discoveries])],
      species: [...new Set([...(save.species || []), ...world.species])],
      quiz_correct: (save.quiz_correct || 0) + (world.quizCorrect || 0),
      quiz_total: (save.quiz_total || 0) + (world.quizTotal || 0),
      character_id: characterId || save.character_id
    };

    try {
      const { data, error } = await client
        .from(TABLE).update(merged).eq("user_id", session.user.id).select().single();
      if (error) throw error;
      save = data;
    } catch (e) {
      console.warn("[cloud] could not save run:", e.message);
      save = { ...save, ...merged };   // keep the session's numbers honest
    }
    notify();
    return save;
  }

  // Push a species unlock straight away, so the Codex survives a closed tab
  // even when the run itself is abandoned.
  async function syncSpecies(speciesIds) {
    if (!client || !session || !save) return;
    const merged = [...new Set([...(save.species || []), ...speciesIds])];
    if (merged.length === (save.species || []).length) return;
    save.species = merged;
    try {
      await client.from(TABLE).update({ species: merged }).eq("user_id", session.user.id);
    } catch (e) { /* retried with the next run save */ }
  }

  async function leaderboard() {
    if (!client) return [];
    try {
      const { data, error } = await client.from("leaderboard").select("*");
      return error ? [] : (data || []);
    } catch (e) { return []; }
  }

  function onChange(fn) { listeners.push(fn); }

  return {
    init, setName, onChange,
    playerName, hasName, isOffline, currentSave,
    pull, recordRun, syncSpecies, leaderboard
  };
})();
