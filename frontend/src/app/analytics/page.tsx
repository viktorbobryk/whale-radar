import { assets, kpis, recentGains, tradeHistory } from "@/data/mock";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { Panel } from "@/components/ui/Panel";

const tone = {
  mint: "text-mint",
  rose: "text-rose",
  text: "text-white",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan">DASHBOARD</p>
        <h1 className="text-2xl font-semibold">Analytics</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Panel key={kpi.label} className="p-4">
            <p className="text-[10px] tracking-[0.14em] text-mist">{kpi.label.toUpperCase()}</p>
            <p className={`mt-2 text-2xl font-semibold tabular-nums ${tone[kpi.tone]}`}>{kpi.value}</p>
            <p className="mt-1 text-sm text-mist">{kpi.sub}</p>
            <p className="mt-2 text-xs text-mist">{kpi.note}</p>
          </Panel>
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <Panel className="p-3">
          <p className="px-2 py-2 text-[10px] tracking-[0.14em] text-mist">ASSETS</p>
          <ul className="space-y-1">
            {assets.map((asset) => (
              <li key={asset.symbol} className="rounded-xl px-2 py-2 hover:bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-cyan/10 text-[10px] font-semibold text-cyan">
                    {asset.symbol}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{asset.name}</p>
                    <p className="text-xs tabular-nums text-mist">{asset.value}</p>
                  </div>
                </div>
                <p className="mt-1 pl-9 text-xs text-mint">{asset.change}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Cumulative PnL growth</h2>
              <p className="mt-1 flex gap-3 text-[11px] text-mist">
                <span>
                  <i className="mr-1 inline-block size-2 rounded-full bg-mint" /> Buy
                </span>
                <span>
                  <i className="mr-1 inline-block size-2 rounded-full bg-rose" /> Sell
                </span>
              </p>
            </div>
            <span className="text-xs text-mist">Oct 18, 2023 · 11:45 AM GMT</span>
          </div>
          <GrowthChart />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-4">
          <h2 className="text-sm font-semibold">Top assets</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex justify-between">
              <span>BTC</span>
              <span className="text-mint">58.3%</span>
            </li>
            <li className="flex justify-between">
              <span>ETH</span>
              <span className="text-cyan">28.2%</span>
            </li>
            <li className="flex justify-between">
              <span>SOL</span>
              <span className="text-amber">13.5%</span>
            </li>
          </ul>
        </Panel>
        <Panel className="p-4">
          <h2 className="text-sm font-semibold">Trade history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {tradeHistory.map((trade) => (
              <li key={trade.time} className="flex items-center justify-between gap-2">
                <span className="text-mist">{trade.time}</span>
                <span>{trade.asset}</span>
                <span className={trade.result.startsWith("−") || trade.result.startsWith("-") ? "text-rose" : "text-mint"}>
                  {trade.result}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-4">
          <h2 className="text-sm font-semibold">Recent gains</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recentGains.map((gain) => (
              <li key={gain.label} className="flex items-center justify-between">
                <span className="text-mist">{gain.label}</span>
                <span className="font-semibold text-mint">{gain.value}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
