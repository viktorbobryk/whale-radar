import Image from "next/image";
import { whales } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { Sparkline } from "@/components/ui/Sparkline";

const chains = ["ETH", "BSC", "SOL", "30D"];

export default function WatchlistPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search wallets</span>
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Search wallets, tags, symbols..."
            className="w-full rounded-full border border-cyan/40 bg-ink/60 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-mist"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {chains.map((chain) => (
            <span key={chain} className="rounded-full border border-cyan/40 px-3 py-2 text-xs font-semibold text-cyan">
              {chain}
            </span>
          ))}
          <span className="rounded-full border border-cyan/40 px-3 py-2 text-xs font-semibold text-cyan">Top gainers</span>
          <button
            type="button"
            disabled
            title="Preview only"
            className="cursor-default rounded-full bg-cyan px-3 py-2 text-xs font-semibold text-ink disabled:opacity-100"
          >
            + Add whale wallet
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {whales.map((whale) => (
          <Panel key={whale.address} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image src="/brand/mark.jpg" alt="" width={32} height={32} className="size-8 rounded-full" />
                <div>
                  <p className="text-[10px] text-mist">#{whale.rank}</p>
                  <p className="font-mono text-sm">{whale.address}</p>
                  <p className="text-xs text-mist">{whale.name}</p>
                </div>
              </div>
              <span className="rounded-full border border-cyan/40 px-2 py-1 text-[10px] font-semibold text-cyan">
                {whale.winRate} win rate
              </span>
            </div>

            <div className="mt-4 grid grid-cols-[1.1fr_0.9fr] items-end gap-3">
              <div>
                <p className="text-[10px] tracking-[0.12em] text-mist">30-DAY PROFIT</p>
                <p className="text-xl font-semibold tabular-nums text-mint">{whale.profit}</p>
              </div>
              <div>
                <Sparkline values={whale.spark} className="h-10 text-mint" />
                <p className="mt-1 text-[11px] text-mist">
                  {whale.note} · {whale.hold}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {whale.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-mist">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
              <span className="text-mist">
                Balance <span className="text-white">{whale.balance}</span>
              </span>
              <span className={whale.day.startsWith("-") ? "text-rose" : "text-mint"}>24h {whale.day}</span>
            </div>
          </Panel>
        ))}
      </div>

      <p className="text-xs text-mist">Market: stable · gas 21 gwei · 24h vol $4.2B</p>
    </div>
  );
}
