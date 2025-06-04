import TroveGradientTitle from "./components/TroveGradientTitle";
import { Text, Heading, Card } from "./components/ui";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-amber-50 dark:bg-zinc-900 px-4">
      <TroveGradientTitle>trove</TroveGradientTitle>
      <Card variant="glass" size="xl" padding="lg" className="w-full mt-2 flex flex-col items-center">
        <Heading level={2} align="center" spacing="lg" className="text-2xl sm:text-3xl text-amber-900 dark:text-amber-100">
          What can trove do for you?
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li><Text size="lg" as="span" variant="secondary">✨ Visual SQL query builder for everyone</Text></li>
          <li><Text size="lg" as="span" variant="secondary">⚡ Instant data previews and exploration</Text></li>
          <li><Text size="lg" as="span" variant="secondary">🔌 Easy connections to your data sources</Text></li>
          <li><Text size="lg" as="span" variant="secondary">🧠 AI first - ask questions, get answers</Text></li>
          <li><Text size="lg" as="span" variant="secondary">💸 No per-seat pricing, ever</Text></li>
          <li><Text size="lg" as="span" variant="secondary">🛠️ 100% open source and extensible</Text></li>
          <li><Text size="lg" as="span" variant="secondary">🎯 Built for PMs, EMs, marketing, partner success, and more</Text></li>
        </ul>
      </Card>
    </main>
  );
}
