// assets.js — image loading with graceful placeholders while art bakes.
const images = new Map();

// opaque art ships as JPEG; anything needing alpha stays PNG
const JPG = [
  "cg_title",
  "bg_real_bedroom", "bg_real_hall", "bg_real_street", "bg_hospital_room",
  "bg_blank_page", "bg_meadow_1", "bg_meadow_2", "bg_meadow_2_clean", "bg_woods_2_risen", "bg_woods_1", "bg_woods_2",
  "bg_bay_1", "bg_bay_2", "bg_keeper_home", "bg_depths_1", "bg_depths_2",
  "pt_mira_neutral", "pt_mira_giggly", "pt_mira_gloomy", "pt_mira_grumpy",
  "pt_biscuit", "pt_wisp", "pt_ren", "pt_stub",
  "cg_memory_1", "cg_memory_2", "cg_memory_3", "cg_memory_4",
  "cg_ending_true", "cg_ending_page", "cg_memory_5", "cg_memory_6", "cg_room_314",
  "bg_dunes_1", "bg_dunes_2", "bg_works_1", "bg_works_2",
];
const PNG = [
  "en_sniffle", "en_scribble", "en_thornbud", "en_buttoncrab", "en_inklet",
  "boss_tangle", "boss_swan", "boss_keeper", "boss_smudge",
  "boss_smoother", "boss_oracle", "boss_unfinished",
  "en_fine", "en_blanket", "en_ticktick", "en_redo",
  "sp_biscuit", "sp_wisp", "sp_guidebook", "sp_swan_fly", "sp_mom_sleep", "sp_letter", "sp_stub",
  "sp_mira_d0", "sp_mira_d1", "sp_mira_l0", "sp_mira_l1",
  "sp_mira_r0", "sp_mira_r1", "sp_mira_u0", "sp_mira_u1",
];
const MANIFEST = [
  ...JPG.map((n) => [n, "jpg"]),
  ...PNG.map((n) => [n, "png"]),
];

// the title screen needs only its own art; everything else loads behind it
// while the player sits on the title (game entry awaits loadRest)
const CRITICAL = new Set(["cg_title"]);

function loadOne(name, ext) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => { images.set(name, img); resolve(true); };
    img.onerror = () => { resolve(false); };
    img.src = `assets/img/${name}.${ext}`;
  });
}

export const assets = {
  missing: [],
  done: 0, total: MANIFEST.length, // load progress, shown on the title screen
  async _load(list) {
    const results = await Promise.all(list.map(async ([n, ext]) => {
      const ok = await loadOne(n, ext);
      this.done++;
      return [n, ok];
    }));
    const missing = results.filter(([, ok]) => !ok).map(([n]) => n);
    if (missing.length) { this.missing.push(...missing); console.warn("missing images:", missing.join(", ")); }
  },
  async init() { // blocking before the title: just the title's art
    await this._load(MANIFEST.filter(([n]) => CRITICAL.has(n)));
  },
  _rest: null,
  loadRest() { // idempotent; started behind the title, awaited on game entry
    if (!this._rest) this._rest = this._load(MANIFEST.filter(([n]) => !CRITICAL.has(n)));
    return this._rest;
  },
  img(name) { return images.get(name) || null; },
  has(name) { return images.has(name); },
};
