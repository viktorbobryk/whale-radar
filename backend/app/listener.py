import asyncio
import logging
from decimal import Decimal
from urllib.parse import urlparse

from web3 import AsyncWeb3, Web3, WebSocketProvider

from app.settings import Settings
from app.swaps import WhaleSwap, decode_swap_log

log = logging.getLogger("whaleradar.listener")

BASE_CHAIN_ID = 8453
TOKEN0_CALL = Web3.keccak(text="token0()")[:4]
TOKEN1_CALL = Web3.keccak(text="token1()")[:4]


def block_number(header) -> int:
    number = header["number"]
    if isinstance(number, int):
        return number
    text = number if isinstance(number, str) else number.hex()
    return int(text, 16)


def format_amount(amount: Decimal) -> str:
    text = f"{amount:.6f}".rstrip("0").rstrip(".")
    return text or "0"


class BaseListener:
    def __init__(self, settings: Settings, stop_after_blocks: int | None = None) -> None:
        self.settings = settings
        self.stop_after_blocks = stop_after_blocks
        self.blocks_seen = 0
        self._pools: dict[str, tuple[str, str] | None] = {}

    async def watch(self) -> None:
        url = self.settings.base_ws_url
        host = urlparse(url).hostname or "base"
        log.info("connecting to %s, watching %s whales", host, len(self.settings.whales))
        async with AsyncWeb3(WebSocketProvider(url)) as w3:
            chain_id = await w3.eth.chain_id
            if chain_id != BASE_CHAIN_ID:
                raise RuntimeError(f"expected Base ({BASE_CHAIN_ID}), connected to {chain_id}")
            await w3.eth.subscribe("newHeads", handler=self._on_head)
            await w3.subscription_manager.handle_subscriptions()

    async def _on_head(self, ctx) -> None:
        try:
            await self._inspect(ctx.async_w3, block_number(ctx.result))
        except Exception:
            log.exception("failed to read block")
        self.blocks_seen += 1
        if self.stop_after_blocks is not None and self.blocks_seen >= self.stop_after_blocks:
            await ctx.subscription.unsubscribe()

    async def _inspect(self, w3: AsyncWeb3, number: int) -> None:
        whales = self.settings.whales
        if not whales:
            log.info("base block %s", number)
            return

        block = await w3.eth.get_block(number, full_transactions=True)
        hits = [tx for tx in block["transactions"] if tx["from"].lower() in whales]
        swaps: list[WhaleSwap] = []
        for tx in hits:
            receipt = await w3.eth.get_transaction_receipt(tx["hash"])
            swaps.extend(await self._swaps_from(w3, number, tx, receipt["logs"]))
        log.info("base block %s whale txs %s swaps %s", number, len(hits), len(swaps))
        for swap in swaps:
            log.info(
                "%s %s %s token %s whale %s tx %s",
                swap.side,
                format_amount(swap.quote_amount),
                swap.quote,
                swap.token,
                swap.whale,
                swap.tx_hash,
            )

    async def _swaps_from(self, w3: AsyncWeb3, number: int, tx, logs) -> list[WhaleSwap]:
        whale = tx["from"].lower()
        tx_hash = tx["hash"].hex()
        if not tx_hash.startswith("0x"):
            tx_hash = f"0x{tx_hash}"
        found: list[WhaleSwap] = []
        for entry in logs:
            if not entry.get("topics"):
                continue
            pair = await self._pool_tokens(w3, entry["address"])
            if pair is None:
                continue
            decoded = decode_swap_log(entry, pair[0], pair[1])
            if decoded is None:
                continue
            side, token, quote, amount = decoded
            found.append(WhaleSwap(number, tx_hash, whale, side, token, quote, amount))
        return found

    async def _pool_tokens(self, w3: AsyncWeb3, pool: str) -> tuple[str, str] | None:
        key = Web3.to_checksum_address(pool).lower()
        if key in self._pools:
            return self._pools[key]
        try:
            token0 = await self._token(w3, pool, TOKEN0_CALL)
            token1 = await self._token(w3, pool, TOKEN1_CALL)
        except Exception:
            self._pools[key] = None
            return None
        self._pools[key] = (token0, token1)
        return self._pools[key]

    async def _token(self, w3: AsyncWeb3, pool: str, call: bytes) -> str:
        raw = await w3.eth.call({"to": Web3.to_checksum_address(pool), "data": call})
        return Web3.to_checksum_address(raw[-20:]).lower()


async def run(settings: Settings | None = None, stop_after_blocks: int | None = None) -> None:
    settings = settings or Settings()
    listener = BaseListener(settings, stop_after_blocks)
    while True:
        try:
            await listener.watch()
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("base connection dropped")
        if stop_after_blocks is not None and listener.blocks_seen >= stop_after_blocks:
            return
        await asyncio.sleep(3)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    logging.getLogger("web3").setLevel(logging.WARNING)
    asyncio.run(run())


if __name__ == "__main__":
    main()
