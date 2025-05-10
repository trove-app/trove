import Image from "next/image";
import TroveGradientTitle from "./components/TroveGradientTitle";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <TroveGradientTitle>TROVE</TroveGradientTitle>
      <section className="w-full max-w-xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 mt-2 flex flex-col items-center border border-slate-200 dark:border-zinc-800">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800 dark:text-zinc-100 text-center">
          What can Trove do for you?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-slate-700 dark:text-zinc-200 text-left">
          <li>✨ Visual SQL query builder for everyone</li>
          <li>⚡ Instant data previews and exploration</li>
          <li>🔌 Easy connections to your data sources</li>
          <li>💸 No per-seat pricing, ever</li>
          <li>🛠️ 100% open source and extensible</li>
          <li>🎯 Built for PMs, EMs, marketing, partner success, and more</li>
        </ul>
      </section>
    </main>
  );
}
