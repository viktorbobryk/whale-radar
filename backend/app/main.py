from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

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
