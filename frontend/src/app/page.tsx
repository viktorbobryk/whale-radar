export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          WhaleRadar
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Пульт відстеження китів
        </h1>
        <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
          Каркас проєкту для Base, Ethereum і Solana. Слухач мережі, auto-copy і
          живий стрім угод ще попереду.
        </p>
      </div>
      <ul className="grid gap-3 text-sm sm:grid-cols-3">
        <li className="rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
          <p className="font-medium">Frontend</p>
          <p className="text-neutral-500">Next.js 15</p>
        </li>
        <li className="rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
          <p className="font-medium">API</p>
          <p className="text-neutral-500">FastAPI · :8000</p>
        </li>
        <li className="rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
          <p className="font-medium">Alerts</p>
          <p className="text-neutral-500">Telegram · Aiogram 3</p>
        </li>
      </ul>
    </main>
  );
}
