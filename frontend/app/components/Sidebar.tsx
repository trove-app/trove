import Link from "next/link";
import TroveGradientTitle from "./TroveGradientTitle";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white/90 dark:bg-zinc-900/90 border-r border-slate-200 dark:border-zinc-800 flex flex-col p-6 gap-4 shadow-md min-h-screen">
      <div className="flex items-center gap-3 mb-8 pl-8">
        {/* The toggle button will be absolutely/fixed positioned outside, so just leave space here */}
        <TroveGradientTitle size="text-3xl">Trove</TroveGradientTitle>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-800 font-medium transition-colors">🏠 Home</Link>
        <Link href="/db-explorer" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-800 font-medium transition-colors">🗄️ DB Explorer</Link>
        <Link href="/sql-builder" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-800 font-medium transition-colors">🛠️ SQL Builder</Link>
        <span className="px-3 py-2 rounded-lg text-slate-400 dark:text-zinc-500 cursor-not-allowed">🔗 Add/Manage DB Connections (coming soon)</span>
      </nav>
    </aside>
  );
}
