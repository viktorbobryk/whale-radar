"""Find the first profitable buyers after a token's Uniswap V3 pool opens on Base.

Buyers are the senders of Swap transactions in the 100 blocks starting at pool
creation. A wallet that buys and sells in the same block is dropped as MEV.
Profit is quote received inside that window, plus tokens still held valued at
the last swap price, minus quote spent. Only wallets in profit are saved.
"""

import argparse
import asyncio
import json
import logging
import os
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path

from eth_abi import decode as abi_decode
from web3 import AsyncHTTPProvider, AsyncWeb3, Web3, WebSocketProvider

log = logging.getLogger("base_pool_scanner")

BASE_CHAIN_ID = 8453
DEFAULT_RPC = "https://mainnet.base.org"
FACTORY = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD"
WINDOW = 100
TOP = 10
OUTPUT = Path(__file__).with_name("discovered_wallets.json")

WETH = "0x4200000000000000000000000000000000000006"
USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
QUOTE_META = {WETH: ("WETH", 18), USDC: ("USDC", 6)}

POOL_CREATED = Web3.keccak(text="PoolCreated(address,address,uint24,int24,address)")
SWAP = Web3.keccak(text="Swap(address,address,int256,int256,uint160,uint128,int24)")
DECIMALS_CALL = Web3.keccak(text="decimals()")[:4]


@dataclass(frozen=True)
class Pool:
    address: str
    token0: str
    token1: str
    fee: int
    block: int
    log_index: int


@dataclass(frozen=True)
class Trade:
    block: int
    log_index: int
    wallet: str
    buy: bool
    token_amount: Decimal
    quote_amount: Decimal


def hex_of(value) -> str:
    if isinstance(value, str):
        text = value.lower()
    else:
        text = value.hex().lower()
    return text if text.startswith("0x") else f"0x{text}"


def topic_address(address: str) -> str:
    return "0x" + address.lower().removeprefix("0x").zfill(64)


def address_from_topic(topic) -> str:
    return ("0x" + hex_of(topic)[-40:]).lower()


def load_env() -> None:
    path = Path(__file__).resolve().parents[1] / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if not text or text.startswith("#") or "=" not in text:
            continue
        key, value = text.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"'))


def rpc_url(explicit: str | None) -> str:
    if explicit:
        return explicit
    load_env()
    for key in ("BASE_RPC_HTTP", "BASE_RPC_WS"):
        value = os.environ.get(key, "").strip()
        if value:
            return value
    return DEFAULT_RPC


async def connect(url: str) -> AsyncWeb3:
    if url.startswith(("ws://", "wss://")):
        w3 = AsyncWeb3(WebSocketProvider(url))
        await w3.provider.connect()
        return w3
    return AsyncWeb3(AsyncHTTPProvider(url, request_kwargs={"timeout": 60}))


async def close(w3: AsyncWeb3) -> None:
    disconnect = getattr(w3.provider, "disconnect", None)
    if disconnect is not None:
        await disconnect()


async def has_code(w3: AsyncWeb3, token: str, block: int) -> bool:
    code = await w3.eth.get_code(Web3.to_checksum_address(token), block_identifier=block)
    return len(code) > 0


async def find_deploy_block(w3: AsyncWeb3, token: str, latest: int) -> int:
    if not await has_code(w3, token, latest):
        raise LookupError(f"{token} has no contract code on Base")
    low = 0
    high = latest
    while low < high:
        mid = (low + high) // 2
        if await has_code(w3, token, mid):
            high = mid
        else:
            low = mid + 1
    return low


async def get_logs(w3: AsyncWeb3, start: int, end: int, topics: list) -> list:
    found: list = []
    cursor = start
    span = min(10_000, end - start + 1)
    while cursor <= end:
        chunk_end = min(cursor + span - 1, end)
        try:
            found.extend(
                await w3.eth.get_logs(
                    {
                        "address": Web3.to_checksum_address(FACTORY),
                        "fromBlock": cursor,
                        "toBlock": chunk_end,
                        "topics": topics,
                    }
                )
            )
        except Exception:
            if span <= 200:
                raise
            span = max(200, span // 2)
            log.info("RPC rejected log range, retrying %s blocks", span)
            continue
        cursor = chunk_end + 1
    return found


async def find_first_pool(w3: AsyncWeb3, token: str, start: int, latest: int) -> Pool:
    padded = topic_address(token)
    found: list[Pool] = []
    cursor = start
    while cursor <= latest and not found:
        span_end = min(cursor + 9_999, latest)
        log.info("looking for PoolCreated in blocks %s-%s", cursor, span_end)
        token0_logs, token1_logs = await asyncio.gather(
            get_logs(w3, cursor, span_end, [POOL_CREATED, padded]),
            get_logs(w3, cursor, span_end, [POOL_CREATED, None, padded]),
        )
        for entry in (*token0_logs, *token1_logs):
            found.append(decode_pool(entry))
        cursor = span_end + 1
    if not found:
        raise LookupError(f"no Uniswap V3 pool for {token}")
    return min(found, key=lambda pool: (pool.block, pool.log_index))


def decode_pool(entry) -> Pool:
    _tick_spacing, pool = abi_decode(["int24", "address"], bytes(entry["data"]))
    return Pool(
        address=pool.lower(),
        token0=address_from_topic(entry["topics"][1]),
        token1=address_from_topic(entry["topics"][2]),
        fee=int(hex_of(entry["topics"][3]), 16),
        block=entry["blockNumber"],
        log_index=entry["logIndex"],
    )


async def decimals_of(w3: AsyncWeb3, token: str) -> int:
    known = QUOTE_META.get(token)
    if known:
        return known[1]
    raw = await w3.eth.call({"to": Web3.to_checksum_address(token), "data": DECIMALS_CALL})
    size = int.from_bytes(raw[-32:], "big")
    return size if 0 < size <= 36 else 18


def quote_symbol(token: str) -> str:
    known = QUOTE_META.get(token)
    return known[0] if known else token


def decode_trade(entry, pool: Pool, token: str, wallet: str, token_decimals: int, quote_decimals: int) -> Trade | None:
    amount0, amount1, *_ = abi_decode(
        ["int256", "int256", "uint160", "uint128", "int24"],
        bytes(entry["data"]),
    )
    target_is_token0 = pool.token0 == token
    token_delta = amount0 if target_is_token0 else amount1
    quote_delta = amount1 if target_is_token0 else amount0
    if token_delta == 0 or quote_delta == 0:
        return None
    scale = Decimal(10)
    return Trade(
        block=entry["blockNumber"],
        log_index=entry["logIndex"],
        wallet=wallet,
        buy=token_delta < 0,
        token_amount=Decimal(abs(token_delta)) / scale**token_decimals,
        quote_amount=Decimal(abs(quote_delta)) / scale**quote_decimals,
    )


async def transaction_senders(w3: AsyncWeb3, hashes: list[str]) -> dict[str, str]:
    gate = asyncio.Semaphore(8)

    async def one(tx_hash: str) -> tuple[str, str | None]:
        async with gate:
            try:
                tx = await w3.eth.get_transaction(tx_hash)
            except Exception:
                log.warning("skipped transaction %s", tx_hash)
                return tx_hash, None
            return tx_hash, tx["from"].lower()

    pairs = await asyncio.gather(*(one(tx_hash) for tx_hash in hashes))
    return {tx_hash: sender for tx_hash, sender in pairs if sender}


async def collect_trades(w3: AsyncWeb3, pool: Pool, token: str, start: int, end: int) -> list[Trade]:
    logs = await w3.eth.get_logs(
        {
            "address": Web3.to_checksum_address(pool.address),
            "fromBlock": start,
            "toBlock": end,
            "topics": [SWAP],
        }
    )
    hashes = list(dict.fromkeys(hex_of(entry["transactionHash"]) for entry in logs))
    senders = await transaction_senders(w3, hashes)
    quote = pool.token1 if pool.token0 == token else pool.token0
    token_decimals, quote_decimals = await asyncio.gather(
        decimals_of(w3, token),
        decimals_of(w3, quote),
    )
    trades: list[Trade] = []
    for entry in logs:
        wallet = senders.get(hex_of(entry["transactionHash"]))
        if not wallet:
            continue
        trade = decode_trade(entry, pool, token, wallet, token_decimals, quote_decimals)
        if trade is not None:
            trades.append(trade)
    trades.sort(key=lambda trade: (trade.block, trade.log_index))
    return trades


def without_mev(trades: list[Trade]) -> list[Trade]:
    sides: dict[tuple[str, int], set[bool]] = defaultdict(set)
    for trade in trades:
        sides[(trade.wallet, trade.block)].add(trade.buy)
    bots = {wallet for (wallet, _), flags in sides.items() if flags == {True, False}}
    if bots:
        log.info("filtered %s same-block round-trip wallets", len(bots))
    return [trade for trade in trades if trade.wallet not in bots]


def rank_buyers(trades: list[Trade], mark: Decimal) -> list[dict]:
    grouped: dict[str, list[Trade]] = defaultdict(list)
    for trade in trades:
        grouped[trade.wallet].append(trade)

    ranked = []
    for wallet, fills in grouped.items():
        if not any(fill.buy for fill in fills):
            continue
        held = Decimal(0)
        spent = Decimal(0)
        received = Decimal(0)
        bought = Decimal(0)
        for fill in fills:
            if fill.buy:
                held += fill.token_amount
                spent += fill.quote_amount
                bought += fill.token_amount
                continue
            sold = min(held, fill.token_amount)
            if fill.token_amount > 0 and sold > 0:
                received += fill.quote_amount * (sold / fill.token_amount)
            held -= sold
        profit = received + held * mark - spent
        if profit <= 0:
            continue
        ranked.append(
            {
                "address": Web3.to_checksum_address(wallet),
                "profit_quote": format(profit, "f"),
                "spent_quote": format(spent, "f"),
                "received_quote": format(received, "f"),
                "tokens_bought": format(bought, "f"),
                "tokens_held": format(held, "f"),
                "first_buy_block": min(fill.block for fill in fills if fill.buy),
                "_profit": profit,
            }
        )
    ranked.sort(key=lambda row: row["_profit"], reverse=True)
    for row in ranked:
        del row["_profit"]
    return ranked[:TOP]


def mark_price(trades: list[Trade]) -> Decimal:
    for trade in reversed(trades):
        if trade.token_amount > 0:
            return trade.quote_amount / trade.token_amount
    return Decimal(0)


async def scan(token: str, url: str) -> dict:
    token = token.lower()
    w3 = await connect(url)
    try:
        chain_id = await w3.eth.chain_id
        if chain_id != BASE_CHAIN_ID:
            raise RuntimeError(f"expected Base ({BASE_CHAIN_ID}), connected to {chain_id}")
        latest = await w3.eth.block_number
        deploy_block = await find_deploy_block(w3, token, latest)
        log.info("token code first appears in block %s", deploy_block)
        pool = await find_first_pool(w3, token, deploy_block, latest)
        start = pool.block
        end = min(pool.block + WINDOW - 1, latest)
        log.info("pool %s fee %s, reading blocks %s-%s", pool.address, pool.fee, start, end)
        trades = await collect_trades(w3, pool, token, start, end)
        log.info("%s swaps in the window", len(trades))
        price = mark_price(trades)
        trades = without_mev(trades)
        quote = pool.token1 if pool.token0 == token else pool.token0
        buyers = rank_buyers(trades, price)
        return {
            "token": Web3.to_checksum_address(token),
            "pool": Web3.to_checksum_address(pool.address),
            "fee": pool.fee,
            "quote": Web3.to_checksum_address(quote),
            "quote_symbol": quote_symbol(quote),
            "pool_created_block": pool.block,
            "from_block": start,
            "to_block": end,
            "mark_price_quote": format(price, "f"),
            "wallets": buyers,
        }
    finally:
        await close(w3)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Find early profitable buyers of a Base token.")
    parser.add_argument("token", help="Token contract address on Base")
    parser.add_argument("--rpc", help="Base HTTP or WebSocket RPC URL")
    return parser.parse_args()


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    args = parse_args()
    if not Web3.is_address(args.token):
        raise SystemExit(f"not an address: {args.token}")
    report = asyncio.run(scan(args.token, rpc_url(args.rpc)))
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    log.info("saved %s wallets to %s", len(report["wallets"]), OUTPUT)


if __name__ == "__main__":
    main()
