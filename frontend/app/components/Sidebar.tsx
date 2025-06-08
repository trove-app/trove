import Link from "next/link";
import TroveGradientTitle from "./TroveGradientTitle";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card dark:bg-card border-r border-border flex flex-col p-6 shadow-md min-h-screen">
      <div className="pl-10 mb-8">
        <TroveGradientTitle size="text-3xl">Trove</TroveGradientTitle>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        <Link href="/" className="px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-muted font-medium transition-colors">🏠 Home</Link>
        <Link href="/db-explorer" className="px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-muted font-medium transition-colors">🗄️ DB Explorer</Link>
        <Link href="/sql-builder" className="px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-muted font-medium transition-colors">🛠️ SQL Builder</Link>
        <span className="px-3 py-2 rounded-lg text-muted-foreground cursor-not-allowed">🔗 Add/Manage DB Connections (coming soon)</span>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
