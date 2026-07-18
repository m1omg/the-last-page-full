// minigame.js — the battle "timed hits": a beat the player presses confirm on
// when swinging (bonus damage), bracing against an enemy act (less damage), or
// reaching out (a drop of Ink back on a perfect). The battle suspends on
// this.minigame exactly like it suspends on msgQ; battle.js owns the gate,
// this module owns the timing, the verdict, and the drawing.
//
// The multipliers deliberately never touch calm/settled/storm — the Reach Out
// beat is flavor plus an orthogonal Ink refund, so the peace route's pacing
// (hearts per round) is structurally identical with the minigames on or off.
import { input } from "./input.js";
import { audio } from "./audio.js";
import { hotspots } from "./hotspots.js";
import { drawBox, drawText, FONT } from "./ui.js";
import { loadSettings, updateSettings, MINIGAME_MODES } from "./settings.js";

// All times in ms. `center` is the beat; distance from it picks the verdict.
// balance_sim.mjs mirrors the mults — keep them in sync (its DIST/…_MULT tables).
export const TIMING = {
  attack: { dur: 1000, center: 680, perfect: 45, good: 150, verdict: 450,
            mults: { perfect: 1.3, good: 1.0, miss: 0.85 } },
  guard:  { dur: 1120, center: 900, perfect: 70, good: 180, verdict: 350,
            mults: { perfect: 0.7, good: 0.85, miss: 1.0 } },
  reach:  { dur: 1060, center: 860, perfect: 60, good: 170, verdict: 450,
            mults: { perfect: 1.0, good: 1.0, miss: 1.0 } }, // bonus applied by battle.js
};

// presses in the first stretch are leftovers from mashing through messages —
// eat them so they can't instantly flub the beat
const GRACE_MS = 120;

const CUE = {
  attack: (mg) => `${mg.actor ? mg.actor.name + " — " : ""}strike on the beat!`,
  guard: () => "brace!",
  reach: () => "reach out…",
};

const VERDICT = {
  attack: { perfect: "PERFECT!!", good: "good", miss: "…missed the beat" },
  guard:  { perfect: "PERFECT!!", good: "good", miss: "…too late" },
  reach:  { perfect: "PERFECT!!", good: "good", miss: "…too late" },
};
const VERDICT_STYLE = {
  perfect: { color: "#e8a53a", size: 34 },
  good:    { color: "#5aa85a", size: 26 },
  miss:    { color: "#8a6a7a", size: 22 },
};

export function startTiming(kind, opts = {}) {
  return {
    kind,
    cfg: TIMING[kind],
    t: 0,            // ms elapsed
    pressT: null,    // ms of the (first, only) press
    quality: null,   // "perfect" | "good" | "miss"
    verdictAt: null, // t at which the verdict was decided (press or timeout)
    doneAt: null,    // t at which the verdict linger ends
    actor: opts.actor || null,
    enemy: opts.enemy || null,
    onDone: opts.onDone || null,
  };
}

// tick + input; returns true once the verdict has lingered and we're done
export function updateTiming(mg, dt) {
  mg.t += dt * 1000;
  if (!mg.quality) {
    if (input.hit("confirm")) {
      input.consume("confirm");
      if (mg.t >= GRACE_MS) {
        mg.pressT = mg.t;
        const d = Math.abs(mg.t - mg.cfg.center);
        mg.quality = d <= mg.cfg.perfect ? "perfect" : d <= mg.cfg.good ? "good" : "miss";
        audio.sfx(mg.quality === "perfect" ? "sfx_save" : mg.quality === "good" ? "sfx_confirm" : "sfx_cancel",
                  mg.quality === "miss" ? 0.5 : 0.8);
        mg.verdictAt = mg.t;
        mg.doneAt = mg.t + mg.cfg.verdict;
      }
    } else if (mg.t >= mg.cfg.dur) {
      mg.quality = "miss";
      mg.verdictAt = mg.t;
      mg.doneAt = mg.t + 150; // timed out: no fanfare, short linger
    }
  } else {
    input.consume("confirm"); // the beat is decided — don't leak into the msgQ
  }
  return mg.doneAt !== null && mg.t >= mg.doneAt;
}

export function timingMult(mg) {
  return mg.cfg.mults[mg.quality] ?? 1.0;
}

// ------------------------------------------------------------ drawing
// anchor = {x, y}: enemy sprite center for guard/reach, bottom-center for attack
export function drawTiming(ctx, mg, anchor) {
  // tap anywhere = confirm; registered every frame like menu hotspots are
  hotspots.add(0, 0, 960, 720, () => input.tap("confirm"));

  if (mg.quality) { drawVerdict(ctx, mg, anchor); return; }

  if (mg.kind === "attack") drawAttack(ctx, mg);
  else drawRing(ctx, mg, anchor);

  const cue = CUE[mg.kind](mg);
  ctx.save();
  ctx.font = `bold 19px ${FONT}`;
  const w = ctx.measureText(cue).width + 36;
  drawBox(ctx, 480 - w / 2, 348, w, 32, { seed: 73 });
  ctx.fillStyle = "#5a4634";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(cue, 480, 365);
  ctx.restore();
}

function drawAttack(ctx, mg) {
  const bx = 280, by = 396, bw = 400, bh = 46;
  drawBox(ctx, bx, by, bw, bh, { seed: 71 });
  const ix = bx + 6, iw = bw - 12; // inner track
  const toX = (ms) => ix + Math.max(0, Math.min(1, ms / mg.cfg.dur)) * iw;
  ctx.save();
  // good window, then the perfect window on top of it
  ctx.fillStyle = "#e8d8a0";
  ctx.fillRect(toX(mg.cfg.center - mg.cfg.good), by + 6, toX(mg.cfg.center + mg.cfg.good) - toX(mg.cfg.center - mg.cfg.good), bh - 12);
  ctx.fillStyle = "rgba(184,69,46,0.45)";
  ctx.fillRect(toX(mg.cfg.center - mg.cfg.perfect), by + 6, toX(mg.cfg.center + mg.cfg.perfect) - toX(mg.cfg.center - mg.cfg.perfect), bh - 12);
  // the sweeping cursor (frozen at the press once decided)
  ctx.fillStyle = "#2a2320";
  ctx.fillRect(toX(mg.pressT ?? mg.t) - 2, by + 3, 4, bh - 6);
  ctx.restore();
}

function drawRing(ctx, mg, anchor) {
  const isReach = mg.kind === "reach";
  const p = Math.max(0, Math.min(1, mg.t / mg.cfg.center)); // 1 = on the beat
  ctx.save();
  if (isReach) {
    // a heart shrinking onto a heart outline
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e88aa0";
    ctx.font = `38px ${FONT}`;
    ctx.globalAlpha = 0.55;
    ctx.fillText("♡", anchor.x, anchor.y);
    ctx.globalAlpha = 0.9;
    ctx.font = `${Math.round(130 - (130 - 38) * p)}px ${FONT}`;
    ctx.fillText("♥", anchor.x, anchor.y);
  } else {
    // an ink ring shrinking onto a dashed target circle
    ctx.strokeStyle = "#b8452e";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#2a2320";
    const r = 150 - (150 - 36) * p;
    // two slightly-off strokes for the hand-drawn look
    for (const off of [0, 2]) {
      ctx.beginPath();
      ctx.arc(anchor.x + off, anchor.y - off, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawVerdict(ctx, mg, anchor) {
  const st = VERDICT_STYLE[mg.quality];
  const linger = Math.max(1, mg.doneAt - mg.verdictAt);
  const a = Math.max(0, 1 - (mg.t - mg.verdictAt) / linger);
  ctx.save();
  ctx.globalAlpha = Math.min(1, a * 1.6);
  drawText(ctx, VERDICT[mg.kind][mg.quality], anchor.x, anchor.y - 30,
    { size: st.size, bold: true, align: "center", color: st.color });
  ctx.restore();
}

// ------------------------------------------------------------ the mode toggle
// mirrors textmode.js: a tiny module over the settings store
const LABELS = { on: "On", auto: "Auto" };

let mode = "on";

export const minigames = {
  init() { mode = loadSettings().minigames; },

  get mode() { return mode; },
  label() { return LABELS[mode]; },

  cycle() {
    mode = MINIGAME_MODES[(MINIGAME_MODES.indexOf(mode) + 1) % MINIGAME_MODES.length];
    updateSettings({ minigames: mode }); // merge — never clobber touch/muted/mobile
    return mode;
  },

  // The smoke/regress harness drives battles blind through ?debug and would
  // hang on a beat, so debug forces Auto unless a test opts in via forceTiming.
  active(game) { return mode === "on" && (!game.debug || game.forceTiming); },
};
