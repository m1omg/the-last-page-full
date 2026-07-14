# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**The Last Page — Full Edition**: a ~2 hour emotional browser JRPG (Omori/Undertale lineage) in vanilla JS + Canvas 2D. **No build step, no runtime dependencies** — ES modules loaded directly; Playwright is a dev-only dependency for the headless tests. Keep it that way: don't add bundlers, frameworks, or runtime packages.

## Commands

```bash
npm run start                            # serve on http://localhost:4321 (python3 http.server)
node tools/validate.mjs                  # static integrity: maps, scripts, assets, data
node tools/regress.mjs                   # regressions for player-reported bugs (Playwright)
node tools/smoke.mjs                     # headless full playthrough, true ending (Playwright)
SMOKE_ENDING=page node tools/smoke.mjs   # dream-ending path
node tools/touch_smoke.mjs               # touch + mouse input matrix (real multi-touch CDP)
node tools/balance_sim.mjs               # Monte-Carlo battle pacing report
node tools/collision_audit.mjs && python3 tools/collision_audit.py  # art vs collision overlays
python3 tools/make_audio.py              # (re)synthesize all BGM/SFX (pure Python, no deps)
python3 tools/post_images.py             # (re)bake images from tools/_raw
```

The game must be served over http — opening `index.html` directly fails because assets load via `fetch`. Add `?debug` to the URL for a collision overlay and `window.__game` hooks (the smoke tests drive the game through these).

There is no separate lint or unit-test runner; `validate.mjs` + the smoke scripts are the test suite. Run `validate.mjs` after any data change and the relevant smoke test after any behavior change.

## Architecture

**Small engine, large data.** `src/*.js` is the engine (~3,300 lines); `src/data/*.js` holds essentially all content — maps, enemies, skills, items, party, and `script.js`, the entire story authored in a cutscene DSL.

- `src/main.js` — bootstrap and the single `game` object. One `requestAnimationFrame` loop; `game.mode` (`title` / `map` / `battle` / `cg` / `credits` / `gameover`) selects what updates and draws. Canvas is 960×720 logical px = a 20×15 grid of 48px tiles.
- Scenes: `map.js` (`MapScene` — painted background, hand-traced collision grid, entities, followers), `battle.js` (`BattleScene` — the turn engine), `menu.js`, `dialogue.js` (typewriter box, portraits, choices), `cutscene.js` (interpreter).
- `src/state.js` — game state is one plain object persisted to localStorage under `"the-last-page-full-save"` (deliberately distinct from the original game's key so both coexist). `isValidSave` structurally validates on load/import; `migrateSave` folds in newly added skills and missing sub-objects.
- Cutscenes are arrays of command objects (`say`, `choice`, `if`/`iflt`/`ifhas`/`ifjournal`, `flag`, `give`/`take`, `tp`, `fade`/`unfade`, `battle`, `page`, `cg`, `heal`, `save`, `ending`, …) interpreted by `cutscene.js`. `game.cutsceneDepth` + `game.abortCutscenes` exist to unwind zombie scripts when the player exits to title mid-script — don't bypass them.
- Map data supports `bgSwaps` (flag-gated background overrides, first match wins) and `gridSwap` (flag-gated collision reshape — validated to only ever *open* tiles, never close them, so a mid-map save can't be trapped).

## Hard rules from the project's history (docs/DEVLOG.md)

- **Save backward-compatibility is sacred.** Saves stay `version: 1`; forward-compat is handled by extending `migrateSave` in `src/state.js`, never by version bumps. Any change touching state shape must be checked against an old save loaded through the real `loadGame` path.
- **Kindness is a mechanic.** Every enemy, including every boss, must remain resolvable without violence (the Reach Out system). Don't add an encounter that breaks this.
- **Balance changes go through the simulator first.** `tools/balance_sim.mjs` mirrors the real battle formulas over the real data files. Target bands: regular enemies 2–4 rounds, first boss ~5, later bosses 6–8, superboss ~11 on the peace route.
- Battle mechanics that interlock (see DEVLOG §7 before touching `battle.js`): the emotion triangle (GIGGLY > GRUMPY > GLOOMY > GIGGLY), the storm gate (a distressed doodle can't hear you until the storm breaks), one heart per enemy per round, calm-softening, boss second wind, and the cheer gamble.
- Don't `pgrep -f`/`pkill -f` the smoke scripts — the pattern matches the invoking shell itself. Use the `grep '[s]moke'` bracket trick or background-job tracking.

## Docs

- `docs/DEVLOG.md` — engineering decisions, battle-system details, and root-caused bugs worth reading before touching battles, saves, cutscene endings, or collision.
- `docs/ORIGIN.md` — the original brief and story bible.
- Art pipeline: prompts in `tools/prompts.json` → GPT Image 2 via `tools/gen_images.sh` → gitignored `tools/_raw/` → `tools/post_images.py` (chroma-key `#00FF00` → alpha, sheet slicing, JPEG for opaque art). Prefer local PIL patches over regenerating for small art fixes.
