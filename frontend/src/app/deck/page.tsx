import { closedPositions, openPositions, type Position } from "@/data/mock";
import { DeckChart } from "@/components/charts/DeckChart";
import { Panel } from "@/components/ui/Panel";
import { Segmented } from "@/components/ui/Segmented";
import { SliderField } from "@/components/ui/SliderField";
import { Toggle } from "@/components/ui/Toggle";

export default function DeckPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-mist">TRADE DECK</p>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-mist">Overview</p>
        </div>
        <div className="flex gap-2">
          <Balance label="Wallet balance" value="$14,580.30" />
          <Balance label="Live PnL" value="+$24.95" hint="Last 24h" positive />
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="space-y-5 p-4">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.14em]">RISK MANAGEMENT</h2>
              <p className="mt-1 text-[10px] tracking-[0.14em] text-mist">COPY-TRADING CONFIGURATION</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Auto-copy</p>
                <p className="text-xs text-mist">Stays off until execution is wired</p>
              </div>
              <Toggle label="Auto-copy" />
            </div>
            <SliderField
              label="ORDER SIZE ($)"
              min={10}
              max={200}
              step={5}
              defaultValue={50}
              color="#f5b942"
              format="usd"
            />
            <SliderField
              label="STOP-LOSS (%)"
              min={-50}
              max={-5}
              step={1}
              defaultValue={-20}
              color="#ff5d6c"
              format="percent"
            />
            <SliderField
              label="TAKE-PROFIT (%)"
              min={20}
              max={300}
              step={5}
              defaultValue={100}
              color="#2ee6ea"
              format="plus"
            />
          </Panel>

          <Panel className="p-4">
            <p className="text-[10px] tracking-[0.14em] text-mist">HONEYPOT SAFETY VERIFICATION</p>
            <div className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3">
              <p className="text-sm font-semibold text-amber">Honeypot shield: active</p>
              <p className="text-xs text-mist">Verified contracts only</p>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-mist">Scan status</dt>
                <dd className="text-mint">Secured</dd>
              </div>
              <div>
                <dt className="text-mist">Verification</dt>
                <dd>
                  Scanned $BRETT: <span className="text-mint">OK</span>
                </dd>
                <dd>
                  $VIRTUAL: <span className="text-mint">OK</span>
                </dd>
              </div>
            </dl>
          </Panel>
        </div>

        <Panel className="p-4">
          <Segmented labels={["All", "Active", "History"]} tabsClassName="mb-4">
            <PositionTable title="Positions" rows={[...openPositions, ...closedPositions]} />
            <PositionTable title="Active open positions (2)" rows={openPositions} />
            <PositionTable title="History" rows={closedPositions} />
          </Segmented>
          <DeckChart />
        </Panel>
      </div>
    </div>
  );
}

function Balance({
  label,
  value,
  hint,
  positive = false,
}: {
  label: string;
  value: string;
  hint?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink/50 px-3 py-2">
      <p className="text-[10px] tracking-[0.12em] text-mist">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${positive ? "text-mint" : ""}`}>{value}</p>
      {hint ? <p className="text-[10px] text-mist">{hint}</p> : null}
    </div>
  );
}

function PositionTable({ title, rows }: { title: string; rows: Position[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold tracking-[0.12em]">{title.toUpperCase()}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="text-[10px] tracking-[0.12em] text-mist">
            <tr className="border-b border-white/5">
              {["#", "Token", "Entry price", "PnL (%)", "PnL ($)", "Time open", "Action"].map((heading) => (
                <th key={heading} className="px-2 py-2 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.token}-${row.time}`} className="border-b border-white/5 last:border-0">
                <td className="px-2 py-3 text-mist">{index + 1}</td>
                <td className="px-2 py-3 font-semibold">{row.token}</td>
                <td className="px-2 py-3 tabular-nums">{row.entry}</td>
                <td className={`px-2 py-3 font-semibold tabular-nums ${row.positive ? "text-mint" : "text-rose"}`}>
                  {row.pnlPct}
                </td>
                <td className={`px-2 py-3 tabular-nums ${row.positive ? "text-mint" : "text-rose"}`}>{row.pnlUsd}</td>
                <td className="px-2 py-3 text-mist">{row.time}</td>
                <td className="px-2 py-3">
                  <div className="flex gap-1.5">
                    <Action label="Emergency exit" />
                    <Action label="Close" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Action({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Preview only"
      className="cursor-default rounded-md border border-rose/50 px-2 py-1 text-[10px] font-semibold tracking-wide text-rose disabled:opacity-100"
    >
      {label.toUpperCase()}
    </button>
  );
}
