"use client";

import { useState, type CSSProperties } from "react";

export function SliderField({
  label,
  min,
  max,
  step,
  defaultValue,
  format,
  color,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  format: "usd" | "percent" | "plus";
  color: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const pct = ((value - min) / (max - min)) * 100;
  const shown = format === "usd" ? `$${value}` : format === "plus" ? `+${value}%` : `${value}%`;

  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium tracking-[0.14em] text-mist">{label}</span>
        <span
          className="rounded-md px-2 py-0.5 font-semibold tabular-nums"
          style={{ color, backgroundColor: `${color}22` }}
        >
          {shown}
        </span>
      </span>
      <input
        className="slider w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => setValue(Number(event.target.value))}
        style={
          {
            background: `linear-gradient(90deg, ${color} ${pct}%, #163246 ${pct}%)`,
            "--thumb": color,
          } as CSSProperties
        }
      />
    </label>
  );
}
