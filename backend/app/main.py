import json

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3

from base_pool_scanner import OUTPUT, rpc_url, scan

app = FastAPI(title="WhaleRadar", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


class DiscoverRequest(BaseModel):
    token: str


@app.post("/api/discover")
async def discover(body: DiscoverRequest) -> dict:
    token = body.token.strip()
    if not Web3.is_address(token):
        raise HTTPException(status_code=400, detail="Enter a token contract address on Base.")
    try:
        report = await scan(token, rpc_url(None))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="The Base RPC request failed. Try again.") from exc
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


@app.get("/api/wallets")
async def list_wallets() -> list:
    return []


@app.get("/api/config")
async def get_config() -> dict:
    return {
        "auto_copy": False,
        "trade_size_usd": 50,
        "stop_loss_percent": 20,
        "take_profit_partial_percent": 50,
        "take_profit_full_percent": 100,
    }


@app.websocket("/ws/live-feed")
async def live_feed(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_json({"type": "ready"})
