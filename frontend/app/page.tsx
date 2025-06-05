import TroveGradientTitle from "./components/TroveGradientTitle";
import { Text, Heading, Card, PageContainer } from "./components/ui";

export default function Home() {
  return (
    <PageContainer centered>
      <TroveGradientTitle>trove</TroveGradientTitle>
      <Card variant="glass" size="xl" padding="lg" className="w-full mt-2 flex flex-col items-center">
        <Heading level={2} align="center" spacing="lg" className="text-2xl sm:text-3xl">
          What can trove do for you?
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li><Text size="lg" as="span">✨ Visual SQL query builder for everyone</Text></li>
          <li><Text size="lg" as="span">⚡ Instant data previews and exploration</Text></li>
          <li><Text size="lg" as="span">🔌 Easy connections to your data sources</Text></li>
          <li><Text size="lg" as="span">🧠 AI first - ask questions, get answers</Text></li>
          <li><Text size="lg" as="span">💸 No per-seat pricing, ever</Text></li>
          <li><Text size="lg" as="span">🛠️ 100% open source and extensible</Text></li>
          <li><Text size="lg" as="span">🎯 Built for PMs, EMs, marketing, partner success, and more</Text></li>
        </ul>
      </Card>
    </PageContainer>
  );
}
