from dataclasses import dataclass
from decimal import Decimal

from eth_abi import decode as abi_decode
from web3 import Web3

from app.settings import QUOTES

V3_SWAP = Web3.keccak(text="Swap(address,address,int256,int256,uint160,uint128,int24)")
V2_SWAP = Web3.keccak(text="Swap(address,uint256,uint256,uint256,uint256,address)")


@dataclass(frozen=True)
class WhaleSwap:
    block: int
    tx_hash: str
    whale: str
    side: str
    token: str
    quote: str
    quote_amount: Decimal


def topic_hex(value) -> str:
    if isinstance(value, str):
        text = value.lower()
    else:
        text = value.hex().lower()
    return text if text.startswith("0x") else f"0x{text}"


def decode_swap_log(log, token0: str, token1: str) -> tuple[str, str, str, Decimal] | None:
    """Return side, token, quote symbol, and quote amount for a WETH or USDC pool."""
    topic = topic_hex(log["topics"][0])
    data = bytes(log["data"])
    if topic == topic_hex(V3_SWAP):
        amount0, amount1, *_ = abi_decode(["int256", "int256", "uint160", "uint128", "int24"], data)
        delta0, delta1 = amount0, amount1
    elif topic == topic_hex(V2_SWAP):
        amount0_in, amount1_in, amount0_out, amount1_out = abi_decode(
            ["uint256", "uint256", "uint256", "uint256"],
            data,
        )
        delta0 = amount0_in - amount0_out
        delta1 = amount1_in - amount1_out
    else:
        return None

    return _quote_leg(token0.lower(), token1.lower(), delta0, delta1)


def _quote_leg(token0: str, token1: str, delta0: int, delta1: int) -> tuple[str, str, str, Decimal] | None:
    """Pool deltas are positive when the pool received that token."""
    quote0 = QUOTES.get(token0)
    quote1 = QUOTES.get(token1)
    if quote0 and not quote1:
        quote_delta, token, quote_name, decimals = delta0, token1, quote0[0], quote0[1]
    elif quote1 and not quote0:
        quote_delta, token, quote_name, decimals = delta1, token0, quote1[0], quote1[1]
    else:
        return None
    if quote_delta == 0:
        return None
    side = "buy" if quote_delta > 0 else "sell"
    amount = Decimal(abs(quote_delta)) / Decimal(10**decimals)
    return side, token, quote_name, amount
