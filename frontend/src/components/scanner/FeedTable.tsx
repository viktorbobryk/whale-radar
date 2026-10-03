"use client";

import { useEffect, useState } from "react";
import type { FeedRow } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { subscribeDetections, type Detection } from "@/components/scanner/radarSound";

const typeTone = {
  BUY: "bg-mint/15 text-mint",
  SELL: "bg-rose/15 text-rose",
  SWAP: "bg-cyan/15 text-cyan",
};

export function FeedTable({ rows }: { rows: FeedRow[] }) {
  const [detection, setDetection] = useState<Detection | null>(null);

  useEffect(() => subscribeDetections(setDetection), []);

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-[0.14em]">LIVE TRANSACTION FEED</h2>
          <p className="text-xs text-mist">Active whale swaps on Base</p>
        </div>
        <span className="rounded-full border border-cyan/30 px-3 py-1 text-[11px] text-cyan">
          All whales · Base · min $50k
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="text-[10px] tracking-[0.12em] text-mist">
            <tr className="border-b border-white/5">
              {["Time", "Type", "Ticker", "Amount", "USD value", "Address", "Tx hash", "Speed"].map((heading) => (
                <th key={heading} className="px-3 py-2 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const hit = detection?.index === index;
              return (
                <tr
                  key={`${row.time}-${row.ticker}-${row.type}-${row.hash}`}
                  className={`border-b border-white/5 last:border-0 ${
                    hit ? (detection?.kind === "mega" ? "bg-amber/10" : "bg-cyan/10") : ""
                  }`}
                >
                  <td className="px-3 py-2.5 tabular-nums text-mist">{row.time}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${typeTone[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold">{row.ticker}</td>
                  <td className="px-3 py-2.5 tabular-nums">{row.amount}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {row.usd}
                    {hit ? (
                      <span className={`ml-2 text-[10px] font-semibold ${detection?.kind === "mega" ? "text-amber" : "text-cyan"}`}>
                        {detection?.kind === "mega" ? "MEGA" : "ALERT"}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <span className="grid size-4 place-items-center rounded-full bg-[#3b82f6] text-[8px] font-bold text-white">
                        B
                      </span>
                      {row.address}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-mist">{row.hash}</td>
                  <td className="px-3 py-2.5 tabular-nums text-mist">{row.speed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
