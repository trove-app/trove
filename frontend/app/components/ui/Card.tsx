import React from 'react';
import { cn } from './utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the card should be clickable */
  clickable?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

const cardVariants = {
  default: "bg-white dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 shadow-sm",
  outlined: "bg-amber-50 dark:bg-transparent border-2 border-amber-300 dark:border-amber-600",
  elevated: "bg-white dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-shadow",
  glass: "bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm border border-amber-200 dark:border-zinc-700 shadow-lg"
};

const cardSizes = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl"
};

const cardPadding = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10"
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  padding = 'md',
  clickable = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Base styles
        "rounded-2xl transition-all duration-200",
        // Variant styles
        cardVariants[variant],
        // Size constraints
        cardSizes[size],
        // Padding
        cardPadding[padding],
        // Clickable styles
        clickable && "cursor-pointer hover:scale-[1.02] hover:shadow-2xl",
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 