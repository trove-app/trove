import Link from "next/link";
import TroveGradientTitle from "./TroveGradientTitle";
import { Text } from "./ui";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card/95 border-r border-border flex flex-col p-6 gap-4 shadow-lg min-h-screen backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8 pl-8">
        {/* The toggle button will be absolutely/fixed positioned outside, so just leave space here */}
        <TroveGradientTitle size="text-3xl">trove</TroveGradientTitle>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
          <Text variant="interactive" weight="medium" as="span">🏠 Home</Text>
        </Link>
        <Link href="/db-explorer" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
          <Text variant="interactive" weight="medium" as="span">🗄️ DB Explorer</Text>
        </Link>
        <Link href="/sql-builder" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
          <Text variant="interactive" weight="medium" as="span">🛠️ SQL Builder</Text>
        </Link>
        <span className="px-3 py-2 rounded-lg cursor-not-allowed opacity-60">
          <Text variant="muted" as="span">🔗 Add/Manage DB Connections (coming soon)</Text>
        </span>
      </nav>
      
      {/* Theme Toggle - positioned at bottom of sidebar */}
      <div className="mt-auto pt-6 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
