import TroveGradientTitle from "./components/TroveGradientTitle";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center 
                     bg-background
                     px-4 py-8">
      <TroveGradientTitle>trove</TroveGradientTitle>
      
      <section className="w-full max-w-xl bg-card/80 backdrop-blur-sm
                         border border-border/50 rounded-xl shadow-treasure
                         p-8 mt-6 flex flex-col items-center">
        <p className="text-lg text-muted-foreground mb-6 text-center">
          Your trusted companion in turning raw data into <span className="text-accent font-medium">golden nuggets</span>
        </p>
        
        <ul className="list-none space-y-4 text-lg text-foreground">
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
            <span>Visual SQL query builder for everyone</span>
          </li>
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
            <span>Instant data previews and exploration</span>
          </li>
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🔌</span>
            <span>Easy connections to your data sources</span>
          </li>
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🧠</span>
            <span>AI first - ask questions, get answers</span>
          </li>
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🛠️</span>
            <span>100% open source and extensible</span>
          </li>
          <li className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            <span>Built for PMs, EMs, marketing, partner success, and more</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
