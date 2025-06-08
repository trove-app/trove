import { cn } from "../utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageContainer({ children, className, centered = true }: PageContainerProps) {
  return (
    <main 
      className={cn(
        "min-h-screen bg-background px-4 py-8",
        // Add flex styling only if centered is true
        centered && "flex flex-col items-center justify-center",
        className
      )}
    >
      {children}
    </main>
  );
} 