"use client";

import { useState } from "react";

export function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((current) => !current)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-cyan" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full transition ${
          on ? "left-5 bg-ink" : "left-0.5 bg-white"
        }`}
      />
    </button>
  );
}
