// regress.mjs — targeted regressions for player-reported bugs (2026-07):
//   1. using a snack on yourself must not read "Mira shares … with Mira"
//   2. Warm Glow and Candlelight must not print the same battle message
//   3. dunes_1 must be open enough that both wild doodles can actually
//      engage someone walking the bottom of the map, and every open tile
//      must be reachable from the entrance
//   4. the Smoother's "Name the erased dog" option must actually name him
//   5. skipping Stub at the tree must still put him in the party before
//      the Smoother fight (he is story-critical everywhere after the dunes)
//   6. old Bay saves must recover the lighthouse's new visual state, while a
//      pre-install bulb save stays pre-install and can still use its bulb
//   7. boss hits must remain exactly 20% stronger than matching player hits,
//      while regular doodles attack more often and hit 15% harder than bosses
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".wav": "audio/wav", ".json": "application/json", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    const data = await readFile(join(root, p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

let step = "boot";
const fail = (msg) => { console.error(`FAIL at [${step}]: ${msg}`); process.exit(1); };

// ---------- static checks (no browser needed)
step = "dunes_1 grid";
const { MAPS } = await import(join(root, "src/data/maps.js"));
{
  const d = MAPS.dunes_1;
  const open = new Set();
  for (let y = 0; y < 15; y++) for (let x = 0; x < 20; x++) if (d.grid[y][x] === ".") open.add(`${x},${y}`);
  const seen = new Set(["10,12"]);
  const q = [[10, 12]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const k = `${x + dx},${y + dy}`;
      if (!open.has(k) || seen.has(k)) continue;
      seen.add(k); q.push([x + dx, y + dy]);
    }
  }
  for (const k of open) if (!seen.has(k)) fail(`tile ${k} unreachable from the dunes_1 entrance`);
  // both wild doodles must sit within chase range (5) of the open bottom
  // walk (rows 11-12), or a player exploring the fan never meets a fight
  const walk = [];
  for (let y = 11; y <= 12; y++) for (let x = 1; x <= 18; x++) if (d.grid[y][x] === ".") walk.push([x, y]);
  for (const e of d.entities.filter((e) => e.sprite?.startsWith("enemy:"))) {
    const min = Math.min(...walk.map(([px, py]) => Math.abs(px - e.x) + Math.abs(py - e.y)));
    if (min > 5) fail(`${e.id} at (${e.x},${e.y}) can never engage from the bottom walk (min dist ${min})`);
  }
}

step = "the dog has a name";
const { ENEMIES } = await import(join(root, "src/data/enemies.js"));
const { SCRIPTS } = await import(join(root, "src/data/script.js"));
{
  const opt = ENEMIES.smoother.reach.find((o) => o.label === "Name the erased dog");
  if (!opt) fail("the Smoother lost its dog-naming option");
  if (!/PATCH/i.test(opt.text)) fail(`"Name the erased dog" does not name him: ${JSON.stringify(opt.text)}`);
  if (!/patch/i.test(ENEMIES.smoother.winText)) fail("the Smoother winText forgot Patch");
  if (!/PATCH/i.test(JSON.stringify(SCRIPTS.s_ghost_dog))) fail("s_ghost_dog forgot Patch");
}

// ---------- live checks
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 980, height: 740 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const g = (expr) => page.evaluate(expr);
const key = async (k) => { await page.keyboard.press(k); await page.waitForTimeout(90); };
const mode = () => g("window.__game.game.mode");

async function driveDialogue(maxMs = 25000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    if (!(await g("window.__game.busy()")) && (await mode()) === "map") return;
    if (await g("window.__game.game.dialogue.active")) await key("KeyZ");
    else await page.waitForTimeout(110);
  }
  fail(`dialogue never went idle (mode=${await mode()})`);
}

step = "boot";
await page.goto(`http://localhost:${port}/?debug`);
await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });
await page.waitForTimeout(500);
await key("KeyZ"); // New Game
// entry awaits the background asset stream (staged loading) — poll, don't sleep
await page.waitForFunction("window.__game.game.mode === 'map'", null, { timeout: 30000 });
await page.waitForTimeout(300);
await driveDialogue();

step = "stub fallback join at the boss";
await g(`window.__game.game.runScript([{ t: "join", member: "biscuit" }, { t: "join", member: "wisp" }])`);
await page.waitForTimeout(200);
await g(`window.__game.tp("dunes_2", 9, 6)`); // straight past the tree — Stub never met
await page.waitForTimeout(400);
await driveDialogue();
await g(`window.__game.game.state.party.forEach(m => { m.maxHp += 16; m.hp = m.maxHp; })`); // ~2 torn pages of growth
await g(`window.__game.tp("dunes_2", 9, 5)`);
await page.waitForTimeout(300);
await page.keyboard.down("ArrowUp"); await page.waitForTimeout(220); await page.keyboard.up("ArrowUp");
{
  const t0 = Date.now();
  let joined = false;
  while ((await mode()) !== "battle") {
    if (Date.now() - t0 > 30000) fail("smoother battle never started");
    joined = joined || (await g("!!window.__game.game.state.flags.stub_joined"));
    await key("KeyZ");
  }
  if (!joined) fail("stub_joined was never set before the boss battle");
  const ids = await g("window.__game.game.state.party.map(m => m.id).join(',')");
  if (!ids.includes("stub")) fail(`stub not in the party at the boss: [${ids}]`);
  const combatants = await g("window.__game.game.battle.party.length");
  if (combatants !== 4) fail(`boss battle started with ${combatants} combatants, expected 4`);
}

step = "battle messages";
// capture messages, then drive the three cases directly on the live battle
await g(`(() => {
  const b = window.__game.game.battle;
  window.__msgs = [];
  const orig = b.queueMsg.bind(b);
  b.queueMsg = (m) => { window.__msgs.push(m); orig(m); };
  b.doItem(b.party[0], { item: "cookie", target: b.party[0] });
  const wisp = b.party.find(m => m.id === "wisp");
  b.party[0].hp = Math.max(1, b.party[0].hp - 30);
  b.doSkill(wisp, { skill: "warm_glow", target: b.party[0] });
  b.party.forEach(m => m.hp = Math.max(1, m.hp - 15));
  b.doSkill(wisp, { skill: "candlelight" });
})()`);
{
  const [cookie, glow, candle] = await g("window.__msgs");
  if (/with Mira/.test(cookie)) fail(`solo snack still reads as sharing with yourself: ${JSON.stringify(cookie)}`);
  if (!/takes a quiet moment with a Sugar Cookie/.test(cookie || "")) fail(`solo snack message looks wrong: ${JSON.stringify(cookie)}`);
  // each heal must describe its own shape: single-target names the friend,
  // party-wide gathers everyone — not just "the two strings differ"
  if (!/closes over Mira/.test(glow || "")) fail(`Warm Glow message wrong: ${JSON.stringify(glow)}`);
  if (!/whole party/.test(candle || "")) fail(`Candlelight message wrong: ${JSON.stringify(candle)}`);
}

step = "heal on a torn friend costs nothing";
await g(`(() => {
  const b = window.__game.game.battle;
  const wisp = b.party.find(m => m.id === "wisp");
  const mira = b.party[0];
  const hpSave = mira.hp;
  mira.hp = 0;
  window.__tornInkBefore = wisp.ink;
  b.doSkill(wisp, { skill: "warm_glow", target: mira });
  window.__tornInkAfter = wisp.ink;
  mira.hp = hpSave;
})()`);
{
  const [before, after] = await g("[window.__tornInkBefore, window.__tornInkAfter]");
  if (before !== after) fail(`Warm Glow on a torn ally still burns ink (${before} -> ${after})`);
  const last = await g("window.__msgs[window.__msgs.length - 1]");
  if (!/torn/.test(last || "")) fail(`no refusal message for healing a torn ally: ${JSON.stringify(last)}`);
}

step = "regular enemy pressure";
await g(`(() => {
  const b = window.__game.game.battle;
  const oldRandom = Math.random;
  const oldParty = b.party;
  const oldWall = b.wall;
  const oldQueueMsg = b.queueMsg;
  const oldAddFloater = b.addFloater;
  const oldShakeT = b.shakeT;
  try {
    const target = { name: "Test Target", hp: 1000, emotion: "neutral", guard: false, def: 0 };
    const attack = { kind: "attack", targets: "all", msg: "ATTACK" };
    const makeEnemy = (boss, acts = [attack]) => ({
      name: boss ? "Test Boss" : "Test Regular", atk: 100, emotion: "neutral", calm: 0,
      def: { boss, acts },
    });
    const hit = (enemy) => {
      target.hp = 1000;
      target.emotion = "neutral";
      b.doEnemyAct(enemy);
      return 1000 - target.hp;
    };

    b.party = [target];
    b.wall = false;
    b.queueMsg = () => {};
    b.addFloater = () => {};
    Math.random = () => 0.5;
    window.__damageCheck = [
      b.dmgTo({ emotion: "neutral", guard: false }, 100, false).dmg,
      hit(makeEnemy(true)),
      hit(makeEnemy(false)),
    ];

    target.hp = 1000;
    target.emotion = "neutral";
    b.doEnemyAct(makeEnemy(true, [{ kind: "bell", msg: "BELL" }]));
    window.__bellDamageCheck = 1000 - target.hp;

    const acts = [
      { kind: "attack", targets: "all", msg: "ATTACK" },
      { kind: "emotion", target: "self", emotion: "grumpy", msg: "EMOTION" },
      { kind: "idle", msg: "IDLE" },
    ];
    const pick = (boss, roll) => {
      target.hp = 1000;
      target.emotion = "neutral";
      const messages = [];
      b.queueMsg = (message) => messages.push(message);
      Math.random = () => roll;
      b.doEnemyAct(makeEnemy(boss, acts));
      return messages[0].split("\\n")[0];
    };
    window.__actChoiceCheck = {
      regular: [pick(false, 0.49), pick(false, 0.74), pick(false, 0.99)],
      boss: pick(true, 0.49),
    };
  } finally {
    Math.random = oldRandom;
    b.party = oldParty;
    b.wall = oldWall;
    b.queueMsg = oldQueueMsg;
    b.addFloater = oldAddFloater;
    b.shakeT = oldShakeT;
  }
})()`);
{
  const [outgoing, bossIncoming, regularIncoming] = await g("window.__damageCheck");
  if (outgoing !== 115 || bossIncoming !== 138 || regularIncoming !== 159) {
    fail(`enemy damage multipliers drifted: got ${outgoing}/${bossIncoming}/${regularIncoming}, want 115/138/159`);
  }
  if ((await g("window.__bellDamageCheck")) !== 10) {
    fail(`boss bell damage changed: got ${await g("window.__bellDamageCheck")}, want 10`);
  }
  const choices = await g("window.__actChoiceCheck");
  if (choices.regular.join(",") !== "ATTACK,EMOTION,IDLE") {
    fail(`regular enemies no longer give attacks double weight: ${JSON.stringify(choices.regular)}`);
  }
  if (choices.boss !== "EMOTION") {
    fail(`boss enemy action selection changed: ${JSON.stringify(choices.boss)}`);
  }
}

step = "battle timing minigame";
// The timing beats suspend the turn engine (battle.minigame gate). Under
// ?debug they stay off unless a test opts in via game.forceTiming — this step
// opts in, proves an attack act suspends on a beat, resolves it as a forced
// PERFECT, and checks the 1.3x multiplier lands where the plain hit is 115
// (the damage anchor asserted above): 100 atk × 1.3 × 1.15 → 150.
await g(`(() => {
  const gme = window.__game.game;
  const b = gme.battle;
  gme.forceTiming = true;
  window.__oldRandom = Math.random;
  Math.random = () => 0.5; // fixed spread, no dodge
  window.__beats = 0;
  const origWith = b.withTiming.bind(b);
  b.withTiming = (k, o, c) => { window.__beats++; origWith(k, o, c); };
  b.msgQ = []; b.msgShown = 0; b.msgDone = false;
  window.__mgTarget = { name: "Beat Target", hp: 1000, maxHp: 1000, emotion: "neutral", guard: false, def: 0 };
  const actor = { name: "Beat Tester", hp: 1, atk: 100, emotion: "neutral", charm: null };
  b.pendingActs = [];
  b.turnQ = [{ kind: "attack", actor, target: window.__mgTarget }];
  b.phase = "anim";
})()`);
await page.waitForTimeout(250);
{
  if (!(await g("!!window.__game.game.battle.minigame"))) fail("attack act did not suspend on a timing beat with forceTiming on");
  if ((await mode()) !== "battle") fail("battle mode lost while a beat was live");
  // force a perfect verdict with the linger already over; the update gate resolves it
  await g(`(() => {
    const mg = window.__game.game.battle.minigame;
    mg.t = mg.cfg.center; mg.pressT = mg.t; mg.quality = "perfect"; mg.verdictAt = mg.t; mg.doneAt = mg.t;
  })()`);
  await page.waitForTimeout(250);
  if (await g("!!window.__game.game.battle.minigame")) fail("perfect beat never resolved");
  const dmg = 1000 - (await g("window.__mgTarget.hp"));
  if (dmg !== 150) fail(`perfect strike dealt ${dmg}, want 150 (1.3x over the 115 anchor)`);
  const hitMsg = await g(`window.__game.game.battle.msgQ.find(m => /Beat Target/.test(m)) || ""`);
  if (!/A perfect strike!/.test(hitMsg)) fail(`perfect strike message missing: ${JSON.stringify(hitMsg)}`);
}
// one brace beat per enemy act — a multi-target swing prompts ONCE and the
// beat resolves through a real (injected) confirm press, covering every target
await g(`(() => {
  const b = window.__game.game.battle;
  b.msgQ = []; b.msgShown = 0; b.msgDone = false;
  window.__beats = 0;
  window.__hpBefore = b.party.map(m => m.hp);
  const foe = { name: "Beat Foe", hp: 500, atk: 30, emotion: "neutral", calm: 0,
    def: { boss: false, acts: [{ kind: "attack", targets: "all", msg: "SWING" }] } };
  b.turnQ = [{ kind: "enemyact", actor: foe }];
  b.phase = "anim";
})()`);
await page.waitForTimeout(250);
{
  if (!(await g("!!window.__game.game.battle.minigame"))) fail("enemy attack did not open a brace beat");
  await g(`window.__game.input.inject("confirm")`); // the real input path decides the verdict
  const t0 = Date.now();
  while (await g("!!window.__game.game.battle.minigame")) {
    if (Date.now() - t0 > 5000) fail("brace beat never resolved after a confirm press");
    await page.waitForTimeout(100);
  }
  if ((await g("window.__beats")) !== 1) fail(`multi-target enemy act opened ${await g("window.__beats")} beats, want 1`);
  const drops = await g("window.__game.game.battle.party.map((m, i) => window.__hpBefore[i] - m.hp)");
  if (!drops.every((d) => d > 0)) fail(`one brace beat should cover every target of the swing, got drops ${JSON.stringify(drops)}`);
}
await g(`(() => {
  Math.random = window.__oldRandom;
  window.__game.game.forceTiming = false;
})()`);

step = "stranded save repair";
// a save that already beat the Smoother without Stub (shipped bug) must come
// back from Continue with Stub folded in by migrateSave
await g(`(() => {
  const member = (id) => ({ id, name: id, portrait: id, hp: 50, maxHp: 50, ink: 20, maxInk: 20,
    atk: 10, def: 6, spd: 8, emotion: "neutral", guard: false, skills: [] });
  localStorage.setItem("the-last-page-full-save", JSON.stringify({
    version: 1, map: "blank_page", x: 9, y: 7, facing: "down",
    flags: { intro_done: true, blank_intro_done: true, biscuit_joined: true, wisp_joined: true, dunes_boss_done: true },
    pages: 3, party: [member("mira"), member("biscuit"), member("wisp")],
    inventory: { cookie: 1, page1: 1, page2: 1, page3: 1 }, journal: {}, steps: 0, playMs: 0,
  }));
})()`);
await page.reload();
await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });
await page.waitForTimeout(500);
await g(`window.__game.game.title.index = 0`); // Continue
await key("KeyZ");
{
  const t0 = Date.now();
  while ((await mode()) !== "map") {
    if (Date.now() - t0 > 20000) fail("Continue never loaded the stranded save");
    await page.waitForTimeout(150);
  }
  const ids = await g("window.__game.game.state.party.map(m => m.id).join(',')");
  if (!ids.includes("stub")) fail(`stranded save not repaired — party is [${ids}]`);
  if (!(await g("!!window.__game.game.state.flags.stub_joined"))) fail("stranded save repaired without setting stub_joined");
  const stub = await g(`JSON.stringify(window.__game.game.state.party.find(m => m.id === "stub"))`).then(JSON.parse);
  if (!stub.skills.length) fail("repaired Stub has no skills");
  // page 3 was earned at the Smoother — the repaired Stub gets that growth
  if (stub.maxHp !== 48 || stub.maxInk !== 30) fail(`repaired Stub missing page-3 growth: ${stub.maxHp}HP/${stub.maxInk}ink (want 48/30)`);
}

step = "lighthouse legacy-save migration";
// Older completed Bay saves predate bay_lighthouse_lit. Continue must derive it
// from the completed Keeper flag without changing the v1 save shape.
await g(`(() => {
  const mira = { id: "mira", name: "Mira", portrait: "mira", hp: 45, maxHp: 45, ink: 20, maxInk: 20,
    atk: 10, def: 6, spd: 8, emotion: "neutral", guard: false, skills: ["doodle_dash"] };
  localStorage.setItem("the-last-page-full-save", JSON.stringify({
    version: 1, map: "bay_2", x: 10, y: 6, facing: "down",
    flags: { bay_boss_done: true }, pages: 4, party: [mira],
    inventory: { page1: 1, page2: 1, page3: 1, page4: 1 }, journal: {}, steps: 0, playMs: 0,
  }));
})()`);
await page.reload();
await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });
await page.waitForTimeout(500);
await g(`window.__game.game.title.index = 0`); // Continue
await key("KeyZ");
{
  const t0 = Date.now();
  while ((await mode()) !== "map") {
    if (Date.now() - t0 > 20000) fail("Continue never loaded the completed Bay save");
    await page.waitForTimeout(150);
  }
  if (!(await g("!!window.__game.game.state.flags.bay_lighthouse_lit"))) {
    fail("completed legacy Bay save did not recover bay_lighthouse_lit");
  }
}

step = "lighthouse install and visual";
// A bulb found before this patch was not yet installed. It must remain usable;
// the script must consume it, set the new flag before its first dialogue line,
// and visibly brighten the lantern room.
await g(`(() => {
  const mira = { id: "mira", name: "Mira", portrait: "mira", hp: 45, maxHp: 45, ink: 20, maxInk: 20,
    atk: 10, def: 6, spd: 8, emotion: "neutral", guard: false, skills: ["doodle_dash"] };
  localStorage.setItem("the-last-page-full-save", JSON.stringify({
    version: 1, map: "bay_2", x: 10, y: 6, facing: "down",
    flags: { bay_bulb_found: true }, pages: 3, party: [mira],
    inventory: { bulb: 1, page1: 1, page2: 1, page3: 1 }, journal: {}, steps: 0, playMs: 0,
  }));
})()`);
await page.reload();
await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });
await page.waitForTimeout(500);
await g(`window.__game.game.title.index = 0`); // Continue
await key("KeyZ");
{
  const t0 = Date.now();
  while ((await mode()) !== "map") {
    if (Date.now() - t0 > 20000) fail("Continue never loaded the pre-install Bay save");
    await page.waitForTimeout(150);
  }
  const preinstall = await g(`({ lit: !!window.__game.game.state.flags.bay_lighthouse_lit,
    bulb: window.__game.game.state.inventory.bulb || 0 })`);
  if (preinstall.lit || preinstall.bulb !== 1) {
    fail(`pre-install Bay save changed during migration: ${JSON.stringify(preinstall)}`);
  }
}
await g(`(() => {
  const game = window.__game.game;
  game.fade = 1; game.fadeTarget = 1; game.mapScene.bannerT = 0;
})()`);
await page.waitForTimeout(150);
const lighthouseLum = () => g(`(() => {
  const c = document.querySelector("canvas");
  const s = c.width / 960; // backing store is hi-DPI-scaled logical 960×720
  const d = c.getContext("2d").getImageData(Math.round(485 * s), 0, Math.round(110 * s), Math.round(145 * s)).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722;
  return sum / (d.length / 4);
})()`);
const unlitLum = await lighthouseLum();
await g(`window.__game.game.runScript("s_lighthouse")`);
await page.waitForTimeout(180);
{
  const installed = await g(`({ lit: !!window.__game.game.state.flags.bay_lighthouse_lit,
    bulb: window.__game.game.state.inventory.bulb || 0 })`);
  if (!installed.lit || installed.bulb !== 0) {
    fail(`lighthouse installation state is wrong: ${JSON.stringify(installed)}`);
  }
}
const litLum = await lighthouseLum();
if (litLum < unlitLum + 4) {
  fail(`lighthouse did not visibly brighten (${unlitLum.toFixed(1)} -> ${litLum.toFixed(1)})`);
}

if (errors.length) fail("console errors during run:\n" + errors.join("\n"));
console.log("REGRESS OK — dunes reachability, Patch, Stub repair, battle messages, regular combat pressure, timing beats, lighthouse state/render");
await browser.close();
server.close();
process.exit(0);
