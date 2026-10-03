"use client";

import { FormEvent, useState } from "react";
import { baseTokens } from "@/data/tokens";
import { Panel } from "@/components/ui/Panel";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Wallet = {
  address: string;
  profit_quote: string;
  spent_quote: string;
  received_quote: string;
  tokens_bought: string;
  tokens_held: string;
  first_buy_block: number;
};

type Report = {
  token: string;
  pool: string;
  fee: number;
  quote_symbol: string;
  pool_created_block: number;
  from_block: number;
  to_block: number;
  wallets: Wallet[];
};

export function DiscoverPanel() {
  const [token, setToken] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = body && typeof body.detail === "string" ? body.detail : "The scan failed.";
        throw new Error(detail);
      }
      setReport(body as Report);
    } catch (caught) {
      setReport(null);
      const message = caught instanceof Error ? caught.message : "The scan failed.";
      setError(message === "Failed to fetch" ? "Cannot reach the API on port 8000." : message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <fieldset>
          <legend className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-mist">TOKEN</legend>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {baseTokens.map((item) => {
              const selected = token === item.address;
              return (
                <label
                  key={item.address}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                    selected ? "border-cyan bg-cyan/10" : "border-white/10 hover:border-cyan/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="token"
                    value={item.address}
                    checked={selected}
                    onChange={() => setToken(item.address)}
                    className="sr-only"
                  />
                  <span className="font-semibold">{item.symbol}</span>
                  <span className="font-mono text-xs text-mist">{short(item.address)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={pending || !token}
          className="rounded-full bg-cyan px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {pending ? "Scanning…" : "Find early buyers"}
        </button>
      </form>

      {pending ? (
        <Panel className="px-4 py-6 text-sm text-mist">
          Reading the Uniswap V3 pool and the first 100 blocks on Base. This can take a minute.
        </Panel>
      ) : null}

      {error ? (
        <Panel className="px-4 py-4 text-sm text-rose">{error}</Panel>
      ) : null}

      {report ? <ReportView report={report} /> : null}

      {!report && !pending && !error ? (
        <Panel className="px-4 py-6 text-sm text-mist">
          Choose a token to list the profitable buyers from the first 100 blocks after its Uniswap V3
          pool opened. Wallets that bought and sold in the same block are left out.
        </Panel>
      ) : null}
    </div>
  );
}

function ReportView({ report }: { report: Report }) {
  const quote = report.quote_symbol;
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-white/5 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-[0.14em]">EARLY BUYERS</h2>
        <p className="mt-1 text-xs text-mist">
          Token {short(report.token)} · pool {short(report.pool)} · fee {report.fee / 10_000}% · blocks{" "}
          {report.from_block}–{report.to_block} · {quote}
        </p>
      </div>
      {report.wallets.length === 0 ? (
        <p className="px-4 py-6 text-sm text-mist">
          No buyer finished this window in profit. Same-block round trips are already excluded.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="text-[10px] tracking-[0.12em] text-mist">
              <tr className="border-b border-white/5">
                {["#", "Wallet", "Profit", "Spent", "Received", "Bought", "Still holding", "First buy"].map(
                  (heading) => (
                    <th key={heading} className="px-3 py-2 font-medium">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {report.wallets.map((wallet, index) => (
                <tr key={wallet.address} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-3 text-mist">{index + 1}</td>
                  <td className="px-3 py-3 font-mono">
                    <a
                      href={`https://basescan.org/address/${wallet.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan hover:underline"
                    >
                      {short(wallet.address)}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-mint">{quoteAmount(wallet.profit_quote, quote)}</td>
                  <td className="px-3 py-3">{quoteAmount(wallet.spent_quote, quote)}</td>
                  <td className="px-3 py-3">{quoteAmount(wallet.received_quote, quote)}</td>
                  <td className="px-3 py-3">{tokens(wallet.tokens_bought)}</td>
                  <td className="px-3 py-3">{tokens(wallet.tokens_held)}</td>
                  <td className="px-3 py-3 text-mist">{wallet.first_buy_block}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function short(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function quoteAmount(value: string, symbol: string) {
  return `${formatNumber(value, valueNumber(value) >= 1 ? 4 : 6)} ${symbol}`;
}

function tokens(value: string) {
  const amount = valueNumber(value);
  if (amount >= 1_000_000) {
    return amount.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
  }
  return formatNumber(value, amount >= 1 ? 2 : 4);
}

function formatNumber(value: string, digits: number) {
  const amount = valueNumber(value);
  if (!Number.isFinite(amount)) return value;
  return amount.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function valueNumber(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : Number.NaN;
}
