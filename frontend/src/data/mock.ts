export type FeedType = "BUY" | "SELL" | "SWAP";

export type FeedRow = {
  time: string;
  type: FeedType;
  ticker: string;
  amount: string;
  usd: string;
  address: string;
  hash: string;
  speed: string;
};

export const feed: FeedRow[] = [
  { time: "14:32:07", type: "SELL", ticker: "$DEGEN", amount: "4.2M", usd: "$38.6K", address: "0x9a…11a2", hash: "0x3c…e1", speed: "2.8s" },
  { time: "14:32:01", type: "BUY", ticker: "$MOG", amount: "2.5B", usd: "$145.3K", address: "0x8d…d6c1", hash: "0x5a…9b", speed: "2.3s" },
  { time: "14:31:58", type: "BUY", ticker: "$BRETT", amount: "1.0M", usd: "$106.7K", address: "0xc4…7f4a", hash: "0x5a…9b", speed: "4.1s" },
  { time: "14:31:55", type: "BUY", ticker: "$TOSHI", amount: "120M", usd: "$92.7K", address: "0xc4…7f4a", hash: "0xde…c3", speed: "4.1s" },
  { time: "14:31:55", type: "BUY", ticker: "$BRETT", amount: "200M", usd: "$92.3K", address: "0xc4…7f4a", hash: "0xde…c3", speed: "3.3s" },
  { time: "14:31:54", type: "SWAP", ticker: "$BRETT", amount: "5.0M", usd: "$98.3K", address: "0xc4…7f4a", hash: "0x5a…9b", speed: "3.4s" },
  { time: "14:31:53", type: "BUY", ticker: "$MOG", amount: "3.5B", usd: "$45.3K", address: "0x8d…d6c1", hash: "0x5a…9b", speed: "2.3s" },
  { time: "14:31:49", type: "SWAP", ticker: "$BRETT", amount: "1.0M", usd: "$64.3K", address: "0x8d…d6c1", hash: "0x5a…9b", speed: "3.2s" },
  { time: "14:31:47", type: "BUY", ticker: "$TOSHI", amount: "120M", usd: "$92.7K", address: "0xc4…7f4a", hash: "0xde…c3", speed: "4.1s" },
  { time: "14:31:20", type: "SWAP", ticker: "$BRETT", amount: "2.5B", usd: "$45.3K", address: "0x8d…d6ce", hash: "0x5a…57", speed: "2.3s" },
  { time: "14:30:58", type: "BUY", ticker: "$VIRTUAL", amount: "86K", usd: "$71.4K", address: "0x2b…90c4", hash: "0x77…a2", speed: "3.6s" },
  { time: "14:30:41", type: "SWAP", ticker: "$MOG", amount: "900M", usd: "$22.1K", address: "0x8d…d6c1", hash: "0x5a…9b", speed: "2.1s" },
];

export const scanners = [
  { network: "Base", detail: "Primary listener", swaps: "128 swaps / 5m", latency: "32ms", load: 86 },
  { network: "Ethereum", detail: "Head of chain", swaps: "46 swaps / 5m", latency: "110ms", load: 54 },
  { network: "Solana", detail: "Processed slot", swaps: "210 swaps / 5m", latency: "48ms", load: 72 },
];

export const radarAlerts = [
  { tone: "mint" as const, title: "Large WETH buy: 154 ETH @ $3.2k", meta: "5m ago" },
  { tone: "cyan" as const, title: "USDC transfer: 1.2M USDC", meta: "12m ago" },
];

export const whales = [
  {
    rank: 1,
    address: "0x4a8c…e8f2",
    name: "AquaWhale",
    winRate: "76%",
    profit: "+$1,452,890.15",
    hold: "6.8 Days",
    tags: ["Uniswap", "PancakeSwap", "Raydium", "Curve"],
    note: "Bought $WBTC",
    balance: "$24.8M",
    day: "+3.12%",
    spark: [12, 14, 13, 18, 17, 22, 28, 26, 34, 40, 38, 46],
  },
  {
    rank: 2,
    address: "0xd2b1…b910",
    name: "BaseHunter",
    winRate: "82%",
    profit: "+$883,410.70",
    hold: "11.2 Days",
    tags: ["Uniswap", "Aerodrome", "Curve"],
    note: "Swapped $LINK",
    balance: "$18.4M",
    day: "+1.84%",
    spark: [20, 18, 22, 21, 26, 24, 30, 33, 31, 36, 42, 40],
  },
  {
    rank: 3,
    address: "0x91ae…c33d",
    name: "SolSniper",
    winRate: "71%",
    profit: "+$83,480.70",
    hold: "13.3 Days",
    tags: ["Raydium", "Orca", "Jupiter"],
    note: "Bought $WIF",
    balance: "$6.1M",
    day: "+0.64%",
    spark: [8, 10, 9, 12, 16, 14, 18, 17, 15, 19, 21, 20],
  },
  {
    rank: 4,
    address: "0x77c0…1ab4",
    name: "CurveGhost",
    winRate: "68%",
    profit: "+$540,220.00",
    hold: "4.1 Days",
    tags: ["Curve", "Uniswap", "Balancer"],
    note: "Bought $ETH",
    balance: "$31.2M",
    day: "-0.42%",
    spark: [30, 28, 32, 29, 27, 31, 26, 24, 28, 25, 22, 23],
  },
  {
    rank: 5,
    address: "0x3e19…90aa",
    name: "DegenPilot",
    winRate: "64%",
    profit: "+$210,440.18",
    hold: "2.4 Days",
    tags: ["Uniswap", "BaseSwap"],
    note: "Bought $BRETT",
    balance: "$2.8M",
    day: "+6.40%",
    spark: [6, 8, 7, 11, 10, 14, 18, 16, 22, 21, 27, 30],
  },
  {
    rank: 6,
    address: "0xab44…7721",
    name: "QuietHands",
    winRate: "79%",
    profit: "+$96,110.55",
    hold: "9.0 Days",
    tags: ["Uniswap", "Sushi", "Curve"],
    note: "Swapped $USDC",
    balance: "$9.6M",
    day: "+1.12%",
    spark: [14, 15, 14, 16, 18, 17, 19, 21, 20, 22, 24, 25],
  },
];

export type Position = {
  token: string;
  entry: string;
  pnlPct: string;
  pnlUsd: string;
  time: string;
  positive: boolean;
};

export const openPositions: Position[] = [
  { token: "$BRETT", entry: "$0.0915", pnlPct: "+35.7%", pnlUsd: "+$17.85", time: "1d 3h", positive: true },
  { token: "$VIRTUAL", entry: "$1.248", pnlPct: "+14.2%", pnlUsd: "+$7.10", time: "6h 21m", positive: true },
];

export const closedPositions: Position[] = [
  { token: "$TOSHI", entry: "$0.00042", pnlPct: "+18.4%", pnlUsd: "+$9.20", time: "Closed", positive: true },
  { token: "$DEGEN", entry: "$0.0120", pnlPct: "-6.1%", pnlUsd: "-$3.05", time: "Closed", positive: false },
  { token: "$MOG", entry: "$0.000003", pnlPct: "+52.0%", pnlUsd: "+$26.00", time: "Closed", positive: true },
];

export const commands = [
  { name: "/start", detail: "Wake the bot", active: false },
  { name: "/whale alerts", detail: "Active", active: true },
  { name: "/filters", detail: "Base, ETH, $100k+", active: false },
  { name: "/track wallet", detail: "Follow an address", active: false },
  { name: "/gas_opt", detail: "Priority fee", active: false },
  { name: "/latency", detail: "RPC timing", active: false },
];

export const telegramAlerts = [
  {
    title: "WHALE BUY!",
    tag: "GREEN TAG +1.4% PROFIT",
    body: "1,250 ETH ($2.1M) moved to wallet 0x3C…2B from Uniswap V3",
    time: "12:04:31 PM",
    hash: "0x9a8…f1a",
    featured: true,
  },
  {
    title: "WHALE SELL $SOL (−0.9%)",
    tag: "ACTIVE",
    body: "1,200 ($3.36M) from Uniswap",
    time: "1:03:23 PM",
  },
  {
    title: "$BTC DEPOSIT (0.7M)",
    tag: "ACTIVE",
    body: "$BTC deposit 0.7M",
    time: "12:08 PM",
  },
  {
    title: "WHALE BUY! $LINK (+2.1% PROFIT)",
    tag: "ACTIVE",
    body: "1,250 ETH ($2.1M) moved to wallet from Uniswap",
    time: "12:06 PM",
  },
];

export const webNotices = [
  { title: "Gas optimizer: high priority (Base)", detail: "<20 gwei", state: "ACTIVE" },
  { title: "Base RPC latency: fast (32ms)", detail: "Route status: fast", state: "" },
  { title: "Portfolio alert: $ETH breakout", detail: "Level crossed on the 1h", state: "" },
];

export const alertTokens = [
  { symbol: "$ETH", label: "Whale activity", change: "Gains 1.4%", spark: [8, 9, 8, 11, 10, 13, 12, 15, 14, 16] },
  { symbol: "$USDC", label: "Flow", change: "Stable", spark: [10, 10, 11, 10, 10, 11, 10, 10, 11, 10] },
  { symbol: "$DEGEN", label: "Surge", change: "Hot", spark: [4, 6, 5, 8, 7, 11, 10, 14, 13, 18] },
];

export const kpis = [
  { label: "Total net profit", value: "+142.7%", sub: "$189,450.12", note: "+$15,680 (24h)", tone: "mint" as const },
  { label: "Win rate", value: "74.2%", sub: "148 wins / 199 trades", note: "Avg win +12.4% · avg loss −5.1%", tone: "text" as const },
  { label: "Gas costs", value: "$1,452.88", sub: "ETH 0.812", note: "Avg cost $7.30 / txn · 98 trades", tone: "rose" as const },
  { label: "Capital", value: "$321,903.00", sub: "Equity $306,222.88", note: "Cash $15,680.12 · leverage 1.2x", tone: "text" as const },
];

export const assets = [
  { symbol: "BTC", name: "Bitcoin", value: "$189,450.12", change: "+$15,680 (24h)" },
  { symbol: "ETH", name: "Ether", value: "$90,812.40", change: "+0.85%" },
  { symbol: "SOL", name: "Solana", value: "$15,680.12", change: "+1.62%" },
];

export const tradeHistory = [
  { time: "Oct 18, 11:40", asset: "ETH", result: "+12.4%" },
  { time: "Oct 17, 16:12", asset: "SOL", result: "+6.1%" },
  { time: "Oct 16, 09:02", asset: "BTC", result: "−2.4%" },
  { time: "Oct 14, 21:18", asset: "ETH", result: "+4.8%" },
];

export const recentGains = [
  { label: "Closed $ETH copy", value: "+$1,690.30" },
  { label: "Partial $BRETT", value: "+$420.00" },
  { label: "Gas rebate", value: "+$18.40" },
];
