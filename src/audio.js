// audio.js — WAV loading, looping BGM with crossfade, one-shot SFX.
import { loadSettings, updateSettings } from "./settings.js";

const ctx = new (window.AudioContext || window.webkitAudioContext)();
const master = ctx.createGain();
master.connect(ctx.destination);

const buffers = new Map();
// restored from settings, so muting survives a reload
let muted = loadSettings().muted;
master.gain.value = muted ? 0 : 1;
let current = null; // { name, source, gain }

// staged loading: the title blocks only on its own theme + every SFX; the
// intro's tracks gate game entry; the rest streams in story order during play
const BGM_GATE = ["bgm_real", "bgm_blank", "bgm_battle"];
const BGM_LATER = ["bgm_meadow", "bgm_boss", "bgm_woods", "bgm_dunes",
  "bgm_bay", "bgm_works", "bgm_depths", "bgm_ending"];
const SFX = ["sfx_blip", "sfx_confirm", "sfx_cancel", "sfx_step", "sfx_hit",
  "sfx_heal", "sfx_emotion", "sfx_save", "sfx_door", "sfx_page",
  "sfx_heartbeat", "sfx_static", "sfx_tear", "sfx_soothe", "sfx_victory",
  "sfx_defeat"];

let wanted = null; // last BGM the game asked for — started on arrival if late

async function fetchDecode(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  return ctx.decodeAudioData(await res.arrayBuffer());
}

async function load(name) {
  try {
    // FLAC first — bit-exact and ~4x smaller than the WAV twin, which stays
    // shipped as the fallback for decoders that can't take FLAC
    let buf;
    try { buf = await fetchDecode(`assets/audio/${name}.flac`); }
    catch (_) { buf = await fetchDecode(`assets/audio/${name}.wav`); }
    buffers.set(name, buf);
    // a track requested before it finished downloading starts the moment
    // it lands, so a fast player never permanently outruns the music
    if (name === wanted && (!current || current.name !== name)) audio.playBgm(name);
  } catch (err) {
    console.warn(`audio missing: ${name}`, err);
  } finally {
    audio.done++;
  }
}

export const audio = {
  // load progress, shown on the title screen; total is fixed up front so the
  // percentage can't jump backwards as the sequential late loads get queued
  done: 0, total: 1 + SFX.length + BGM_GATE.length + BGM_LATER.length,
  async init() { // blocking before the title: its theme + every SFX (~3MB)
    await Promise.all(["bgm_title", ...SFX].map(load));
  },
  async loadGate() { // the intro's tracks — game entry awaits these
    await Promise.all(BGM_GATE.map(load));
  },
  async loadLater() { // the rest, story order, one at a time so early areas land first
    for (const n of BGM_LATER) await load(n);
  },
  // browsers block audio until a user gesture
  unlock() {
    if (ctx.state === "suspended") ctx.resume();
  },
  playBgm(name, { fade = 0.8 } = {}) {
    wanted = name;
    if (current && current.name === name) return;
    const buf = buffers.get(name);
    const t = ctx.currentTime;
    if (current) {
      current.gain.gain.setValueAtTime(current.gain.gain.value, t);
      current.gain.gain.linearRampToValueAtTime(0, t + fade);
      const old = current.source;
      setTimeout(() => { try { old.stop(); } catch (e) {} }, fade * 1000 + 60);
      current = null;
    }
    if (!buf) return;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.85, t + fade);
    source.connect(gain).connect(master);
    source.start();
    current = { name, source, gain };
  },
  stopBgm({ fade = 0.8 } = {}) {
    wanted = null;
    if (!current) return;
    const t = ctx.currentTime;
    current.gain.gain.setValueAtTime(current.gain.gain.value, t);
    current.gain.gain.linearRampToValueAtTime(0, t + fade);
    const old = current.source;
    setTimeout(() => { try { old.stop(); } catch (e) {} }, fade * 1000 + 60);
    current = null;
  },
  get bgmName() { return current ? current.name : null; },
  sfx(name, vol = 1) {
    const buf = buffers.get(name);
    if (!buf) return;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    source.connect(gain).connect(master);
    source.start();
  },
  toggleMute() {
    muted = !muted;
    master.gain.value = muted ? 0 : 1;
    updateSettings({ muted });
    return muted;
  },
  isMuted() { return muted; },
};
