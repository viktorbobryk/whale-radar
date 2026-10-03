import { feed } from "@/data/mock";

/** Matches `.radar-sweep` in globals.css. */
const SCAN_SECONDS = 4;
const MEGA_USD = 100_000;

const FILES = {
  sonar: "/sounds/sonar_ping.wav?v=pack",
  song: "/sounds/whale_song.wav?v=pack",
  alert: "/sounds/whale_alert.wav?v=pack",
  horn: "/sounds/mega_whale_horn.wav?v=pack",
} as const;

type SoundName = keyof typeof FILES;

export type Detection = {
  index: number;
  kind: "alert" | "mega";
};

const listeners = new Set<(detection: Detection | null) => void>();

let context: AudioContext | null = null;
let master: GainNode | null = null;
const buffers: Partial<Record<SoundName, AudioBuffer>> = {};
const playing = new Set<AudioBufferSourceNode>();
let timer = 0;
let active = false;
let starting = false;
let primed = false;
let scan = 0;
let cursor = 0;

function usdOf(label: string) {
  const match = label.replace(/[$,]/g, "").trim().match(/^([\d.]+)([KMB])?$/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = (match[2] ?? "").toUpperCase();
  const scale = unit === "B" ? 1_000_000_000 : unit === "M" ? 1_000_000 : unit === "K" ? 1_000 : 1;
  return amount * scale;
}

function emit(detection: Detection | null) {
  listeners.forEach((listener) => listener(detection));
}

export function subscribeDetections(listener: (detection: Detection | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function ensureContext() {
  if (!context) context = new AudioContext();
  return context;
}

async function loadBuffers(ctx: AudioContext) {
  await Promise.all(
    (Object.keys(FILES) as SoundName[]).map(async (name) => {
      if (buffers[name]) return;
      const response = await fetch(FILES[name]);
      buffers[name] = await ctx.decodeAudioData(await response.arrayBuffer());
    }),
  );
}

function play(name: SoundName, level: number) {
  const buffer = buffers[name];
  if (!context || !master || !buffer) return;
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = level;
  source.connect(gain);
  gain.connect(master);
  source.start();
  playing.add(source);
  source.onended = () => playing.delete(source);
}

function tick() {
  if (!active) return;
  play("sonar", 0.85);
  scan += 1;
  if (scan % 3 !== 0) return;
  const index = cursor % feed.length;
  cursor += 1;
  const mega = usdOf(feed[index].usd) >= MEGA_USD;
  play(mega ? "horn" : "alert", mega ? 0.95 : 0.8);
  emit({ index, kind: mega ? "mega" : "alert" });
}

export function enableRadarSound() {
  const ctx = ensureContext();
  if (!master) {
    master = ctx.createGain();
    master.connect(ctx.destination);
  }
  active = true;
  if (primed || starting) {
    void ctx.resume();
    return;
  }
  starting = true;
  void ctx
    .resume()
    .then(async () => {
      try {
        if (!active || !context) return;
        await loadBuffers(context);
        if (!active || !context || primed) return;
        primed = true;
        tick();
        window.clearInterval(timer);
        timer = window.setInterval(tick, SCAN_SECONDS * 1000);
      } finally {
        starting = false;
      }
    })
    .catch(() => {
      starting = false;
    });
}

export function disableRadarSound() {
  active = false;
  primed = false;
  scan = 0;
  window.clearInterval(timer);
  timer = 0;
  playing.forEach((source) => {
    try {
      source.stop();
    } catch {
      /* already ended */
    }
  });
  playing.clear();
  emit(null);
}
