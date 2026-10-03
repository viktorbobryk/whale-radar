"use client";

import { useEffect, useRef, useState } from "react";
import { radarAlerts } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { disableRadarSound, enableRadarSound } from "@/components/scanner/radarSound";

const SOUND_KEY = "whaleradar.radarSound";

const RINGS = [12, 20, 28, 36, 44];
const LABELS = [
  { text: "1M+", radius: 44 },
  { text: "500k", radius: 36 },
  { text: "250k", radius: 28 },
  { text: "100k", radius: 20 },
  { text: "50k", radius: 12 },
];
const BLIPS = [
  { angle: 210, radius: 30, trail: true },
  { angle: 250, radius: 18, trail: false },
  { angle: 190, radius: 40, trail: true },
  { angle: 160, radius: 22, trail: false },
  { angle: 140, radius: 36, trail: true },
  { angle: 110, radius: 14, trail: false },
  { angle: 95, radius: 28, trail: true },
  { angle: 70, radius: 38, trail: false },
  { angle: 320, radius: 24, trail: true },
  { angle: 300, radius: 16, trail: false },
  { angle: 20, radius: 34, trail: true },
  { angle: 350, radius: 26, trail: false },
];

function place(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const percent = (value: number) => `${value.toFixed(4)}%`;
  return {
    left: percent(50 + Math.cos(rad) * radius),
    top: percent(50 + Math.sin(rad) * radius),
  };
}

export function Radar() {
  const [soundOn, setSoundOn] = useState(false);
  const [sweepEpoch, setSweepEpoch] = useState(0);
  const pendingStart = useRef<((event: PointerEvent) => void) | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(SOUND_KEY) === "on";
    setSoundOn(saved);
    if (!saved) return () => disableRadarSound();

    const start = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-radar-sound]")) return;
      pendingStart.current = null;
      window.removeEventListener("pointerdown", start);
      enableRadarSound();
      setSweepEpoch((epoch) => epoch + 1);
    };
    pendingStart.current = start;
    window.addEventListener("pointerdown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      pendingStart.current = null;
      disableRadarSound();
    };
  }, []);

  function clearPendingStart() {
    if (!pendingStart.current) return;
    window.removeEventListener("pointerdown", pendingStart.current);
    pendingStart.current = null;
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    clearPendingStart();
    if (next) {
      enableRadarSound();
      setSweepEpoch((epoch) => epoch + 1);
      return;
    }
    disableRadarSound();
  }

  return (
    <Panel className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.18em]">RADAR</h2>
        <button
          type="button"
          aria-pressed={soundOn}
          data-radar-sound
          aria-label={soundOn ? "Turn scanner sounds off" : "Turn scanner sounds on"}
          onClick={toggleSound}
          className={`grid size-8 place-items-center rounded-full border ${
            soundOn
              ? "border-cyan/50 bg-cyan/15 text-cyan"
              : "border-white/10 text-mist hover:text-white"
          }`}
        >
          {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2ee6ea" stopOpacity="0.2" />
              <stop offset="72%" stopColor="#2ee6ea" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#2ee6ea" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#radarGlow)" stroke="#2ee6ea" strokeOpacity="0.9" strokeWidth="0.7" />
          {RINGS.map((radius) => (
            <circle
              key={radius}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#2ee6ea"
              strokeOpacity="0.28"
              strokeWidth="0.35"
            />
          ))}
          <path d="M50 4 V96 M4 50 H96" stroke="#2ee6ea" strokeOpacity="0.22" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="1.2" fill="#2ee6ea" />
        </svg>
        <div key={sweepEpoch} className="radar-sweep pointer-events-none absolute inset-[4%] rounded-full" />
        {LABELS.map((label) => (
          <span
            key={label.text}
            className="absolute -translate-y-1/2 text-[10px] font-medium text-cyan/80"
            style={place(32, label.radius)}
          >
            {label.text}
          </span>
        ))}
        {BLIPS.map((blip) => (
          <span key={`${blip.angle}-${blip.radius}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={place(blip.angle, blip.radius)}>
            {blip.trail ? (
              <span
                className="absolute left-1/2 top-1/2 h-px w-5 bg-gradient-to-l from-cyan to-transparent"
                style={{ transform: `translateY(-50%) rotate(${blip.angle}deg)` }}
              />
            ) : null}
            <span className="relative block size-2.5 rounded-full bg-cyan shadow-[0_0_12px_#2ee6ea]" />
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-mist">RECENT ALERTS</p>
        {radarAlerts.map((alert) => (
          <div key={alert.title} className="flex items-center justify-between gap-3 text-sm">
            <p className="min-w-0 truncate">
              <span className={alert.tone === "mint" ? "text-mint" : "text-cyan"}>▲ </span>
              {alert.title}
            </p>
            <span className="shrink-0 text-xs text-mist">{alert.meta}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 10v4h3l4 3V7L7 10H4z" />
      <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M18.2 7.2a6.5 6.5 0 0 1 0 9.6" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 10v4h3l4 3V7L7 10H4z" />
      <path d="M16 10l4 4M20 10l-4 4" />
    </svg>
  );
}
