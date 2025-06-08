import React from 'react';
import { cn } from './utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
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
  default: "bg-card border border-border shadow-sm",
  outlined: "bg-muted border-2 border-accent",
  elevated: "bg-card border border-border shadow-lg hover:shadow-xl transition-shadow",
  glass: "bg-card/95 backdrop-blur-sm border border-border shadow-lg"
};

const cardSizes = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full"
};

const cardPadding = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10"
};

// Compound component interfaces
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

// Compound components
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pt-6 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'Card.Header';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = 'Card.Content';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pt-4 pb-6', className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'Card.Footer';

// Main Card component type
interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

// Main Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  size = 'md',
  padding = 'md',
  clickable = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base styles
        "rounded-2xl transition-all duration-200",
        // Variant styles
        cardVariants[variant],
        // Size constraints
        cardSizes[size],
        // Padding
        padding !== 'none' && cardPadding[padding],
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
}) as CardComponent;

// Add compound components to Card
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps }; 