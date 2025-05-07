import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <h1
        className="text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-400 dark:from-cyan-400 dark:via-pink-500 dark:to-yellow-300 drop-shadow-lg transition-transform duration-300 hover:scale-105 select-none cursor-pointer animate-gradient-x bg-[length:200%_200%] mb-8"
      >
        TROVE
      </h1>
      <section className="w-full max-w-xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 mt-2 flex flex-col items-center border border-slate-200 dark:border-zinc-800">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800 dark:text-zinc-100 text-center">What's Coming to Trove?</h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-slate-700 dark:text-zinc-200 text-left">
          <li>✨ Visual SQL query builder for everyone</li>
          <li>⚡ Instant data previews and exploration</li>
          <li>🤝 Collaborative dashboards and sharing</li>
          <li>🔌 Easy connections to your data sources</li>
          <li>💸 No per-seat pricing, ever</li>
          <li>🛠️ 100% open source and extensible</li>
          <li>🎯 Built for PMs, EMs, marketing, partner success, and more</li>
        </ul>
      </section>
    </main>
  );
}
