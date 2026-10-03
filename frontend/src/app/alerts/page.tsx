import Image from "next/image";
import { alertTokens, commands, telegramAlerts, webNotices } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { Sparkline } from "@/components/ui/Sparkline";

export default function AlertsPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan">NOTIFICATION DASHBOARD</p>
          <h1 className="text-2xl font-semibold">Alerts</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-cyan px-3 py-1 font-semibold text-ink">Base</span>
          <span className="rounded-full border border-cyan/30 px-3 py-1 text-cyan">Ethereum</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-mist">Solana</span>
          <span className="rounded-full border border-mint/30 px-3 py-1 text-mint">ETH 1D +1.4%</span>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <Panel className="p-3">
          <div className="mb-3 flex items-center gap-2 px-1">
            <Image src="/brand/mark.jpg" alt="" width={28} height={28} className="size-7 rounded-full" />
            <p className="text-xs font-semibold tracking-[0.14em]">BOT COMMAND DECK</p>
          </div>
          <ul className="space-y-2">
            {commands.map((command) => (
              <li
                key={command.name}
                className={`rounded-xl border px-3 py-2 ${
                  command.active ? "border-cyan/50 bg-cyan/10" : "border-white/10"
                }`}
              >
                <p className="font-mono text-sm">{command.name}</p>
                <p className="text-[11px] text-mist">{command.detail}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-[0.12em]">INSTANT TELEGRAM ALERTS</h2>
            <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-semibold text-mint">ACTIVE</span>
          </div>
          <div className="space-y-3">
            {telegramAlerts.map((alert) => (
              <article
                key={alert.title}
                className={`rounded-xl border p-3 ${alert.featured ? "border-cyan/40 bg-cyan/5" : "border-white/10"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-[11px] text-mint">{alert.tag}</p>
                  </div>
                  <span className="text-[11px] text-mist">{alert.time}</span>
                </div>
                <p className="mt-2 text-sm text-mist">{alert.body}</p>
                {alert.hash ? (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-mist">Tx: {alert.hash}</p>
                    <button
                      type="button"
                      disabled
                      title="Preview only"
                      className="cursor-default rounded-full bg-cyan px-3 py-1 text-[11px] font-semibold text-ink disabled:opacity-100"
                    >
                      Follow / track
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-4">
            <h2 className="text-sm font-semibold tracking-[0.12em]">WEBAPP NOTIFICATIONS</h2>
            <ul className="mt-3 space-y-3">
              {webNotices.map((notice) => (
                <li key={notice.title} className="rounded-xl border border-white/10 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm">{notice.title}</p>
                    {notice.state ? (
                      <span className="text-[10px] font-semibold text-mint">{notice.state}</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-mist">{notice.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-4">
            <h2 className="mb-3 text-sm font-semibold tracking-[0.12em]">WHALE ALERTS · BASE</h2>
            <div className="grid grid-cols-3 gap-2">
              {alertTokens.map((token) => (
                <div key={token.symbol} className="rounded-xl border border-cyan/20 p-2">
                  <p className="text-sm font-semibold">{token.symbol}</p>
                  <p className="text-[10px] text-mist">{token.label}</p>
                  <Sparkline values={token.spark} className="mt-2 h-8 text-cyan" />
                  <p className="mt-1 text-[10px] text-mint">{token.change}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
