import { feed, scanners } from "@/data/mock";
import { FeedTable } from "@/components/scanner/FeedTable";
import { Radar } from "@/components/scanner/Radar";
import { Panel } from "@/components/ui/Panel";
import { Segmented } from "@/components/ui/Segmented";

export default function ScannerPage() {
  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.15fr)]">
      <Radar />
      <Segmented labels={["Live feed", "Active scanners"]} tabsClassName="mb-3">
        <FeedTable rows={feed} />
        <ScannerList />
      </Segmented>
    </div>
  );
}

function ScannerList() {
  return (
    <Panel className="divide-y divide-white/5">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold tracking-[0.14em]">ACTIVE SCANNERS</h2>
        <p className="text-xs text-mist">Listeners standing by for this preview</p>
      </div>
      {scanners.map((scanner) => (
        <div key={scanner.network} className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{scanner.network}</p>
              <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-semibold text-mint">Listening</span>
            </div>
            <p className="mt-1 text-xs text-mist">
              {scanner.detail} · {scanner.swaps}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan" style={{ width: `${scanner.load}%` }} />
            </div>
          </div>
          <p className="text-sm tabular-nums text-cyan">{scanner.latency}</p>
        </div>
      ))}
    </Panel>
  );
}
