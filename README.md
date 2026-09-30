# WhaleRadar

Персональний full-stack бот для відстеження ончейн-свопів китів і копіювання угод на DEX. Цільове використання — self-use на мережах Base, Ethereum і Solana. Стартова мережа — Base.

## Стек

| Частина | Технології |
| --- | --- |
| Пульт керування | Next.js 15, Tailwind CSS |
| API і live-feed | Python, FastAPI, WebSocket |
| Слухач і виконання угод | Web3.py, приватний RPC (Alchemy / QuickNode) |
| Події | Redis Pub/Sub |
| Дані | PostgreSQL (локально можна замінити на SQLite) |
| Сповіщення | Telegram, Aiogram 3 |

## Як це працює

1. У базу додаються 3–5 перевірених гаманців (Win Rate вище 65% за 30 днів; джерела на кшталт GMGN.ai, Dune, DeBank).
2. Python-слухач через WebSocket RPC ловить swap цільового гаманця в mempool або в першому блоці.
3. Перед купівлею скрипт симулює продаж через `eth_call` і відсікає honeypot, спалені мінти та екстремальні податки.
4. Якщо токен проходить перевірку і auto-copy увімкнено, бот купує його на фіксовану суму ($30–$50) ключем окремого гаманця.
5. Вихід: частковий take-profit біля +50%, повний біля +100% (або повтор продажу кита), stop-loss біля −20%.
6. Подія йде в Redis, звідти в браузер (`/ws/live-feed`) і в Telegram.

Приватний ключ живе тільки в `.env` на сервері. Фронтенд його не бачить.

## Структура

```
WhaleRadar/
  frontend/          Next.js 15 — пульт керування
  backend/           FastAPI — /health, /api/wallets, /api/config, /ws/live-feed
  bot/               Telegram-бот (Aiogram 3)
  docker-compose.yml PostgreSQL і Redis
  .env.example
```

Зараз це каркас: ендпоінти відповідають, слухач блокчейну, перевірка контрактів і виконання свопів ще не реалізовані.

## Запуск

Потрібні Node.js 20+, Python 3.12+ і Docker.

```powershell
Copy-Item .env.example .env
docker compose up -d

cd frontend
npm install
npm run dev
```

Бекенд (потрібен Python 3.12+; на цій машині його ще немає):

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Бот:

```powershell
cd bot
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# TELEGRAM_BOT_TOKEN у .env
python main.py
```

Фронтенд: http://localhost:3000  
API: http://localhost:8000/health

## Пульт (план інтерфейсу)

- Живий стрім угод
- Перемикач Auto-Copy і ліміти ставки, stop-loss, take-profit
- Менеджер китів: адреса, тег, win rate, PnL
- Графік токена з точками входу
- Emergency close для відкритих позицій

## Безпека

1. Для бота — окремий новий гаманець. Основний гаманець не використовувати.
2. Приватний ключ тільки в `.env` на сервері.
3. Старт на Base: низька комісія і великий потік нових пулів.
4. Розмір угоди — мала частка депозиту. Спочатку мікро-суми, потім калібрування.

## План розробки

1. **Слухач.** AsyncWeb3, нові блоки Base по WebSocket, фільтр за адресами китів, декод swap (токен і сума WETH/USDC).
2. **Безпека і виконання.** Аудит через `eth_call`, swap `exactInputSingle` на Uniswap V3, сповіщення в Telegram.
3. **Пульт.** Redis Pub/Sub, жива таблиця, налаштування auto-copy, менеджер гаманців.
4. **Прод.** `docker-compose` на VPS (backend, redis, frontend, bot), прогін на малих ордерах.
