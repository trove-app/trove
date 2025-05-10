import React from "react";

interface TroveGradientTitleProps {
  size?: string; // Tailwind font size class, e.g. 'text-7xl', 'text-3xl'
  className?: string;
  children: React.ReactNode;
}

export default function TroveGradientTitle({ size = "text-7xl sm:text-9xl", className = "", children }: TroveGradientTitleProps) {
  return (
    <h1
      className={`${size} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-400 dark:from-cyan-400 dark:via-pink-500 dark:to-yellow-300 drop-shadow-lg transition-transform duration-300 hover:scale-105 select-none cursor-pointer animate-gradient-x bg-[length:200%_200%] mb-8 ${className}`}
    >
      {children}
    </h1>
  );
} 