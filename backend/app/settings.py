from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_BASE_WS = "wss://base-rpc.publicnode.com"

WETH = "0x4200000000000000000000000000000000000006"
USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
QUOTES = {
    WETH: ("WETH", 18),
    USDC: ("USDC", 6),
}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    base_rpc_ws: str = ""
    whale_addresses: str = ""

    @property
    def base_ws_url(self) -> str:
        return self.base_rpc_ws.strip() or PUBLIC_BASE_WS

    @property
    def whales(self) -> frozenset[str]:
        found: set[str] = set()
        for raw in self.whale_addresses.split(","):
            address = raw.strip().lower()
            if len(address) == 42 and address.startswith("0x"):
                found.add(address)
        return frozenset(found)
