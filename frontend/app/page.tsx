import TroveGradientTitle from "./components/TroveGradientTitle";
import { Text, Heading, Card, Container, Link } from "./components/ui";
import { cn, layoutPatterns } from "./components/ui/utils";

export default function Home() {
  return (
    <Container 
      maxWidth="7xl" 
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <TroveGradientTitle>trove</TroveGradientTitle>
      
      <Card 
        variant="glass" 
        size="xl" 
        padding="lg" 
        className={cn(
          "w-full mt-2",
          layoutPatterns.flexCol,
          layoutPatterns.spacing.md
        )}
      >
        <Heading level={2} align="center" spacing="lg" className="text-2xl sm:text-3xl">
          What can trove do for you?
        </Heading>
        
        <ul className={cn(
          "list-disc list-inside",
          layoutPatterns.spacing.sm,
          "text-left"
        )}>
          <li><Text size="lg" as="span">✨ Visual SQL query builder for everyone</Text></li>
          <li><Text size="lg" as="span">⚡ Instant data previews and exploration</Text></li>
          <li><Text size="lg" as="span">🔌 Easy connections to your data sources</Text></li>
          <li><Text size="lg" as="span">🧠 AI first - ask questions, get answers</Text></li>
          <li><Text size="lg" as="span">💸 No per-seat pricing, ever</Text></li>
          <li><Text size="lg" as="span">🛠️ 100% open source and extensible</Text></li>
          <li><Text size="lg" as="span">🎯 Built for PMs, EMs, marketing, partner success, and more</Text></li>
        </ul>
        
        <div className={cn(
          "mt-8",
          layoutPatterns.flexCol,
          "sm:flex-row gap-4 items-center"
        )}>
          <Link 
            href="/sql-builder"
            variant="button"
            size="lg"
            className="font-semibold"
          >
            Start Building Queries ✨
          </Link>
          <Link 
            href="/db-explorer"
            variant="default"
            size="lg"
            className="font-semibold px-6 py-2 border-2 border-primary-500 rounded-lg hover:bg-primary-50"
          >
            Explore Your Data 🔍
          </Link>
        </div>
      </Card>
    </Container>
  );
}
