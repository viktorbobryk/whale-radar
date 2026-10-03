"use client";

import { Children, useState, type ReactNode } from "react";

export function Segmented({
  labels,
  children,
  className = "",
  tabsClassName = "",
}: {
  labels: string[];
  children: ReactNode;
  className?: string;
  tabsClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const panels = Children.toArray(children);

  return (
    <div className={className}>
      <div role="tablist" className={`flex flex-wrap gap-1 ${tabsClassName}`}>
        {labels.map((label, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setIndex(itemIndex)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                selected ? "bg-cyan text-ink" : "text-mist hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="min-w-0">
        {panels[index]}
      </div>
    </div>
  );
}
