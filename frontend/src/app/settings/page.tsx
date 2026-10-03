import Image from "next/image";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";

const networks = [
  { name: "Base", detail: "Primary network", on: true },
  { name: "Ethereum", detail: "Head listener", on: true },
  { name: "Solana", detail: "Slot listener", on: false },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-mist">PREFERENCES</p>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <Panel className="flex items-center gap-4 p-4">
        <Image
          src="/brand/logo.jpg"
          alt="WhaleRadar emblem"
          width={72}
          height={72}
          className="size-16 rounded-full"
        />
        <div>
          <p className="font-semibold">WhaleRadar</p>
          <p className="text-sm text-mist">Personal whale scanner for Base, Ethereum, and Solana.</p>
        </div>
      </Panel>

      <Panel className="divide-y divide-white/5">
        <h2 className="px-4 py-3 text-sm font-semibold tracking-[0.12em]">NETWORKS</h2>
        {networks.map((network) => (
          <div key={network.name} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm font-medium">{network.name}</p>
              <p className="text-xs text-mist">{network.detail}</p>
            </div>
            <Toggle label={network.name} defaultOn={network.on} />
          </div>
        ))}
      </Panel>

      <Panel className="divide-y divide-white/5">
        <h2 className="px-4 py-3 text-sm font-semibold tracking-[0.12em]">ALERTS</h2>
        <Row label="Telegram alerts" detail="@whale_radar_bot" on />
        <Row label="Web notifications" detail="In-app banner" on />
        <Row label="Honeypot shield" detail="Verified contracts only" on />
      </Panel>
    </div>
  );
}

function Row({ label, detail, on }: { label: string; detail: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-mist">{detail}</p>
      </div>
      <Toggle label={label} defaultOn={on} />
    </div>
  );
}
