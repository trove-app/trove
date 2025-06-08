import Link from "next/link";
import TroveGradientTitle from "./TroveGradientTitle";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card/80 backdrop-blur-sm border-r border-border/50 
                      flex flex-col p-6 shadow-treasure min-h-screen">
      <div className="pl-10 mb-8">
        <TroveGradientTitle size="text-3xl">Trove</TroveGradientTitle>
      </div>
      
      <nav className="flex flex-col gap-3 flex-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
                     text-foreground font-medium
                     hover:bg-primary-100 dark:hover:bg-muted 
                     hover:shadow-soft dark:hover:shadow-none
                     transform hover:translate-x-1
                     transition-all duration-200 ease-in-out"
        >
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </Link>
        
        <Link 
          href="/db-explorer" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
                     text-foreground font-medium
                     hover:bg-primary-100 dark:hover:bg-muted 
                     hover:shadow-soft dark:hover:shadow-none
                     transform hover:translate-x-1
                     transition-all duration-200 ease-in-out"
        >
          <span className="text-xl">🗄️</span>
          <span>DB Explorer</span>
        </Link>
        
        <Link 
          href="/sql-builder" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
                     text-foreground font-medium
                     hover:bg-primary-100 dark:hover:bg-muted 
                     hover:shadow-soft dark:hover:shadow-none
                     transform hover:translate-x-1
                     transition-all duration-200 ease-in-out"
        >
          <span className="text-xl">🛠️</span>
          <span>SQL Builder</span>
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
                        text-muted-foreground cursor-not-allowed
                        opacity-75">
          <span className="text-xl">🔗</span>
          <span>Add/Manage DB Connections (coming soon)</span>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-border/50">
        <ThemeToggle />
      </div>
    </aside>
  );
}
