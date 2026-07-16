// balance_sim.mjs — Monte-Carlo battle pacing check (dev tool, not CI).
//
// Mirrors the combat formulas in src/battle.js (damage, emotion triangle,
// storm gate / settle / repeat rules, second wind, calm softening) against the
// REAL data files, and prints median rounds + party survival per encounter for
// both routes. If battle.js formulas change, keep this in sync.
//
//   node tools/balance_sim.mjs
import { ENEMIES, TROOPS } from "../src/data/enemies.js";
import { PARTY_DEFS } from "../src/data/party.js";
import { SKILLS } from "../src/data/skills.js";

const ADV = { giggly: "grumpy", grumpy: "gloomy", gloomy: "giggly" };
const advMult = (a, d) => (ADV[a] === d ? 1.4 : ADV[d] === a ? 0.75 : 1.0);
const RUNS = 400;
const DAMAGE_MULT = 1.15; // shared pacing multiplier, applied in both directions
const ENEMY_DAMAGE_MULT = 1.20; // battle.js: enemy-to-party difficulty increase
const REGULAR_ENEMY_DAMAGE_MULT = 1.15; // battle.js: extra non-boss damage
const REGULAR_ATTACK_WEIGHT = 2; // battle.js: non-boss attack selection weight

// pages = torn pages collected before this fight: each grants +8 maxHp/+4 maxInk
// (see the "page" command in src/cutscene.js) — the party's only growth
function mkParty(ids, pages = 0, charms = {}) {
  return ids.map((id) => {
    const d = structuredClone(PARTY_DEFS[id]);
    const hp = d.hp + pages * 8, ink = d.ink + pages * 4;
    return { id, ...d, hp, ink, maxHp: hp, maxInk: ink, emotion: "neutral", guard: false,
             charm: charms[id] || null };
  });
}
function mkFoes(troop) {
  return TROOPS[troop].map((id) => {
    const d = ENEMIES[id];
    return { id, def: d, hp: d.hp, maxHp: d.hp, atk: d.atk, defs: d.def, spd: d.spd,
             emotion: d.emotion || "neutral", storm: d.emotion || "neutral",
             calm: 0, lastReach: null, settled: 0, rallied: false, surged: 0, guard: false, soothed: false };
  });
}

function enemyDamageMult(e) {
  return ENEMY_DAMAGE_MULT * (e && !e.def.boss ? REGULAR_ENEMY_DAMAGE_MULT : 1);
}

function dmgTo(t, raw, wall, isParty, sourceEnemy = null) {
  let dmg = raw * DAMAGE_MULT * (isParty ? enemyDamageMult(sourceEnemy) : 1);
  if (t.emotion === "grumpy") dmg *= 1.15;
  if (t.emotion === "gloomy") dmg *= 0.85;
  const guardMult = t.charm === "charm_locket" ? 0.35 : 0.5; // battle.js: Crumb Locket
  if (t.guard) dmg *= guardMult;
  if (wall && isParty) dmg *= guardMult;
  dmg = Math.max(1, Math.round(dmg * (0.85 + Math.random() * 0.3)));
  if (t.emotion === "giggly" && Math.random() < 0.12) return 0;
  return dmg;
}

function playerHit(a, t, mult) {
  if (t.def.immune) return 0;
  let raw = (a.atk + (a.charm === "charm_sunbadge" ? 3 : 0)) * mult;
  if (a.emotion === "grumpy") raw *= 1.2;
  raw *= advMult(a.emotion, t.emotion);
  raw -= t.defs * 0.55;
  return dmgTo(t, Math.max(1, raw), false, false);
}

function chooseEnemyAct(e) {
  const acts = e.def.acts;
  if (e.def.boss) return acts[Math.floor(Math.random() * acts.length)];

  const weightOf = (act) => act.kind === "attack" ? REGULAR_ATTACK_WEIGHT : 1;
  let roll = Math.random() * acts.reduce((total, act) => total + weightOf(act), 0);
  for (const act of acts) {
    roll -= weightOf(act);
    if (roll < 0) return act;
  }
  return acts[acts.length - 1];
}

function enemyAct(e, party, wall) {
  const act = chooseEnemyAct(e);
  const alive = party.filter((m) => m.hp > 0);
  if (!alive.length) return;
  const soften = Math.max(0.7, 1 - 0.045 * e.calm);
  if (act.kind === "attack") {
    const list = act.targets === "all" ? alive : [alive[Math.floor(Math.random() * alive.length)]];
    for (const t of list) {
      let raw = e.atk * (act.mult || 1) * soften;
      if (e.emotion === "grumpy") raw *= 1.2;
      if (e.emotion === "giggly") raw *= 1.15; // overexcited — swings wild
      raw *= advMult(e.emotion, t.emotion);
      raw -= t.def * 0.55;
      t.hp = Math.max(0, t.hp - dmgTo(t, Math.max(1, raw), wall, true, e));
    }
  } else if (act.kind === "emotion") {
    if (act.target === "self") e.emotion = act.emotion;
    else alive[Math.floor(Math.random() * alive.length)].emotion = act.emotion;
  } else if (act.kind === "defend") {
    e.guard = true;
  } else if (act.kind === "bell") {
    for (const t of alive) {
      t.emotion = "gloomy";
      t.hp = Math.max(0, t.hp - Math.max(1, Math.round((5 + Math.floor(Math.random() * 4)) * DAMAGE_MULT * enemyDamageMult(e) * soften)));
    }
  }
}

function reach(e, o, actor) {
  if (!o.good) { e.calm = Math.max(0, e.calm - 1); if (e.emotion !== "giggly") e.emotion = e.storm; e.lastReach = null; return; }
  if (o.label === e.lastReach && e.emotion !== "giggly") return; // giggly takes an encore
  if (e.emotion === e.storm) { e.emotion = "neutral"; e.lastReach = o.label; return; }
  // battle.js: Rainy-Day Stamp raises the settle cap for its wearer's reaches
  if (e.settled >= (e.emotion === "giggly" ? 2 : 1) + (actor && actor.charm === "charm_stamp" ? 1 : 0)) return;
  e.calm++; e.settled++; e.lastReach = o.label;
  if (e.calm >= e.def.calmNeed) { e.soothed = true; return; }
  if (e.def.rotate) {
    const cycle = ["grumpy", "gloomy", "giggly"];
    e.storm = cycle[(cycle.indexOf(e.storm) + 1) % cycle.length];
    e.emotion = e.storm;
    e.lastReach = null;
  } else if (e.def.boss &&
      ((e.surged === 0 && e.calm >= Math.ceil(e.def.calmNeed / 2)) ||
       (e.surged === 1 && e.def.calmNeed >= 6 && e.calm === e.def.calmNeed - 1))) {
    // battle.js: the surge — half hearts, and the last heart on big bosses
    e.surged++;
    e.emotion = e.storm;
    e.lastReach = null;
  }
}

// one battle; policy = "peace" | "fight". Returns { rounds, survived, partyHpLeft }
function sim(partyIds, troop, policy, pages, charms = {}) {
  const party = mkParty(partyIds, pages, charms);
  const foes = mkFoes(troop);
  // battle.js: Warm Ribbon — every doodle starts already listening
  if (party.some((m) => m.charm === "charm_ribbon")) {
    for (const f of foes) if (f.def.calmNeed && !f.def.reachStory) f.emotion = "neutral";
  }
  const aliveFoes = () => foes.filter((f) => f.hp > 0 && !f.soothed);
  let wall = false;

  for (let round = 1; round <= 40; round++) {
    wall = false;
    for (const f of foes) f.settled = 0;
    const acts = [];
    // --- party decisions (simple competent play) ---
    for (const m of party.filter((p) => p.hp > 0)) {
      const foesNow = aliveFoes();
      if (!foesNow.length) break;
      const e = foesNow[0];
      const hurt = party.find((p) => p.hp > 0 && p.hp < p.maxHp * 0.4);
      if (hurt && m.id === "wisp" && m.ink >= 5) { acts.push({ t: "heal", m, tgt: hurt }); continue; }
      if (m.id === "stub") {
        const wisp = party.find((p) => p.id === "wisp" && p.hp > 0 && p.ink < 5);
        if (wisp && m.ink >= 6) { m.ink -= 6; wisp.ink = Math.min(wisp.maxInk, wisp.ink + 6); continue; }
      }
      if (hurt && m.id !== "wisp" && Math.random() < 0.5) { acts.push({ t: "snack", m, tgt: hurt }); continue; }
      // any real player walls once the boss rallies
      if (m.id === "biscuit" && e.rallied && m.ink >= 3 && !wall) { m.ink -= 3; wall = true; continue; }
      if (policy === "peace") {
        // shift the storm with the right skill when available, else reach
        if (e.emotion === e.storm) {
          const sk = m.skills.map((s) => SKILLS[s]).find((s) => s.kind === "emotion" && s.target === "enemy" && s.emotion !== e.storm);
          if (sk && m.ink >= sk.ink) { acts.push({ t: "shift", m, tgt: e, sk }); continue; }
        }
        const good = e.def.reach.filter((o) => o.good && (o.label !== e.lastReach || e.emotion === "giggly"));
        acts.push({ t: "reach", m, tgt: e, o: good[Math.floor(Math.random() * good.length)] || e.def.reach.find((o) => o.good) });
      } else {
        const atkSk = m.skills.map((s) => [s, SKILLS[s]]).find(([, s]) => s.kind === "attack");
        if (atkSk && m.ink >= atkSk[1].ink) { m.ink -= atkSk[1].ink; acts.push({ t: "hit", m, tgt: e, mult: atkSk[1].mult, selfEmotion: atkSk[1].selfEmotion }); }
        else acts.push({ t: "hit", m, tgt: e, mult: 1.0 });
      }
    }
    // --- enemies queue (with second wind) ---
    for (const e of aliveFoes()) {
      if (e.def.boss && !e.def.immune && !e.rallied && e.hp <= e.maxHp / 2) e.rallied = true;
      acts.push({ t: "enemy", e });
      if (e.rallied) acts.push({ t: "enemy", e });
    }
    acts.sort((a, b) => ((b.m || b.e).spd || 0) - ((a.m || a.e).spd || 0));
    // --- resolve ---
    for (const a of acts) {
      if (a.m && a.m.hp <= 0) continue;
      if (a.e && (a.e.hp <= 0 || a.e.soothed)) continue;
      if (a.t === "hit") {
        const tgt = a.tgt.hp > 0 && !a.tgt.soothed ? a.tgt : aliveFoes()[0];
        if (!tgt) continue;
        tgt.hp = Math.max(0, tgt.hp - playerHit(a.m, tgt, a.mult));
        if (a.selfEmotion) a.m.emotion = a.selfEmotion;
      } else if (a.t === "shift") {
        if (a.m.ink >= a.sk.ink && a.tgt.hp > 0 && !a.tgt.soothed) { a.m.ink -= a.sk.ink; a.tgt.emotion = a.sk.emotion; }
      } else if (a.t === "reach") {
        if (a.tgt.hp > 0 && !a.tgt.soothed && a.o) reach(a.tgt, a.o, a.m);
      } else if (a.t === "heal") {
        if (a.m.ink >= 5) { a.m.ink -= 5; a.tgt.hp = Math.min(a.tgt.maxHp, a.tgt.hp + 25); }
      } else if (a.t === "snack") {
        a.tgt.hp = Math.min(a.tgt.maxHp, a.tgt.hp + 20); // cookie
      } else if (a.t === "enemy") {
        enemyAct(a.e, party, wall);
      }
      if (!party.some((p) => p.hp > 0)) return { rounds: round, survived: false };
      if (!aliveFoes().length) return { rounds: round, survived: true };
    }
    for (const m of party) { m.guard = false; if (m.emotion === "gloomy" && m.hp > 0) m.ink = Math.min(m.maxInk, m.ink + 1); }
    for (const e of foes) e.guard = false;
  }
  return { rounds: 40, survived: party.some((p) => p.hp > 0) };
}

function report(label, partyIds, troop, pages = 0, charms = null) {
  for (const policy of ["fight", "peace"]) {
    if (policy === "fight" && ENEMIES[TROOPS[troop][0]].immune) continue;
    if (policy === "fight" && charms) continue; // charm rows: peace pacing is the question
    const rs = [], deaths = { n: 0 };
    for (let i = 0; i < RUNS; i++) {
      const r = sim(partyIds, troop, policy, pages, charms || {});
      rs.push(r.rounds);
      if (!r.survived) deaths.n++;
    }
    rs.sort((a, b) => a - b);
    const med = rs[Math.floor(rs.length / 2)];
    const p90 = rs[Math.floor(rs.length * 0.9)];
    console.log(`${label.padEnd(26)} ${policy.padEnd(6)} median ${String(med).padStart(2)}  p90 ${String(p90).padStart(2)}  losses ${(deaths.n / RUNS * 100).toFixed(0)}%`);
  }
}

console.log("encounter                  route  rounds");
report("tutorial (Mira solo)", ["mira"], "t_sniffle");
report("meadow scribble (duo)", ["mira", "biscuit"], "t_scribble");
report("meadow pair (duo)", ["mira", "biscuit"], "t_meadow_pair");
report("TANGLE (duo)", ["mira", "biscuit"], "t_boss_tangle");
report("woods thornbud (trio)", ["mira", "biscuit", "wisp"], "t_thornbud", 1);
report("SWAN (trio)", ["mira", "biscuit", "wisp"], "t_boss_swan", 1);
report("dunes fine (trio)", ["mira", "biscuit", "wisp"], "t_fine", 2);
report("dunes pair (trio)", ["mira", "biscuit", "wisp"], "t_dunes_pair", 2);
report("SMOOTHER (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_boss_smoother", 2);
report("bay clasp (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_crab", 3);
report("KEEPER (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_boss_keeper", 3);
report("works ticktick (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_ticktick", 4);
report("works pair (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_works_pair", 4);
report("ORACLE (quartet)", ["mira", "biscuit", "wisp", "stub"], "t_boss_oracle", 4);
report("depths inklet pair (4)", ["mira", "biscuit", "wisp", "stub"], "t_inklet_pair", 5);
report("EMBER superboss (4, 6pg)", ["mira", "biscuit", "wisp", "stub"], "t_boss_unfinished", 6);

// charmed peace runs — ribbon from the dunes bench, stamp from Patch, locket
// from the works conveyor. This is the loadout a thorough player brings.
const RS  = { mira: "charm_stamp", wisp: "charm_ribbon" };
const RSL = { mira: "charm_stamp", wisp: "charm_ribbon", biscuit: "charm_locket" };
console.log("--- with charms (peace route) ---");
report("SMOOTHER +ribbon/stamp", ["mira", "biscuit", "wisp", "stub"], "t_boss_smoother", 2, RS);
report("KEEPER +ribbon/stamp", ["mira", "biscuit", "wisp", "stub"], "t_boss_keeper", 3, RS);
report("works pair +charms", ["mira", "biscuit", "wisp", "stub"], "t_works_pair", 4, RSL);
report("ORACLE +charms", ["mira", "biscuit", "wisp", "stub"], "t_boss_oracle", 4, RSL);
report("depths inklets +charms", ["mira", "biscuit", "wisp", "stub"], "t_inklet_pair", 5, RSL);
report("EMBER +charms (6pg)", ["mira", "biscuit", "wisp", "stub"], "t_boss_unfinished", 6, RSL);
