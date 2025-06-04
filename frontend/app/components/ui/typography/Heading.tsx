import React from 'react';
import { cn } from '../utils/cn';
import { BaseComponentProps, ColorVariant } from '../types';

// Heading-specific props
export interface HeadingProps extends BaseComponentProps {
  /** Heading level (h1-h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Color variant for the heading */
  variant?: ColorVariant | 'default';
  /** Font weight - headings default to bold */
  weight?: 'medium' | 'semibold' | 'bold' | 'extrabold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether heading should be muted/secondary */
  muted?: boolean;
  /** Add spacing below the heading */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

// Heading level styles following Trove typography scale
const levelVariants = {
  1: 'text-4xl md:text-5xl lg:text-6xl leading-tight',  // 36px → 48px → 60px
  2: 'text-3xl md:text-4xl lg:text-5xl leading-tight',  // 30px → 36px → 48px
  3: 'text-2xl md:text-3xl lg:text-4xl leading-snug',   // 24px → 30px → 36px
  4: 'text-xl md:text-2xl lg:text-3xl leading-snug',    // 20px → 24px → 30px
  5: 'text-lg md:text-xl lg:text-2xl leading-normal',   // 18px → 20px → 24px
  6: 'text-base md:text-lg lg:text-xl leading-normal',  // 16px → 18px → 20px
};

// Color variant styles - enhanced for data exploration contexts
const colorVariants = {
  // Default text colors
  default: 'text-foreground',                    // Primary text color
  primary: 'text-foreground',                    // Same as default
  
  // Brand colors from Trove style guide
  gold: 'text-primary-500',                      // Treasure Gold - for highlights
  brown: 'text-secondary-600',                   // Chest Brown - warm secondary
  
  // Status colors for data states
  success: 'text-success-600 dark:text-success-400',    // Data loaded successfully
  warning: 'text-warning-500 dark:text-warning-400',    // Data warnings/alerts  
  error: 'text-error-600 dark:text-error-400',          // Data errors
  info: 'text-info-600 dark:text-info-400',             // Data information
  
  // Semantic text colors for data exploration
  muted: 'text-muted-foreground',                       // Secondary/helper text
  subtle: 'text-muted-foreground/80',                   // Even more subtle
  accent: 'text-accent-foreground',                     // Accent text
  
  // Data-specific semantic colors (headings often announce sections)
  metric: 'text-primary-600 dark:text-primary-400',     // Key metrics/KPIs sections
  insight: 'text-secondary-600 dark:text-secondary-400', // Data insights sections
  nugget: 'text-primary-500 font-extrabold',            // Data nuggets (special heading!)
  
  // Interactive states (less common for headings)
  interactive: 'text-foreground hover:text-primary-600 transition-colors',
  link: 'text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline',
  
  // Light variants for subtlety
  light: 'text-foreground/70',
  lighter: 'text-foreground/50',
  
  // Legacy variant for backward compatibility
  secondary: 'text-secondary-600',               // Chest Brown from theme
};

// Font weight styles - headings are typically bolder
const weightVariants = {
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

// Text alignment styles
const alignVariants = {
  left: 'text-left',
  center: 'text-center', 
  right: 'text-right',
};

// Spacing variants for margin-bottom
const spacingVariants = {
  none: '',
  sm: 'mb-2',
  md: 'mb-4',
  lg: 'mb-6',
};

/**
 * Heading component for h1-h6 elements with responsive typography
 * 
 * Follows Trove style guide with bold, rounded, modern styling
 * Uses responsive text sizes that scale up on larger screens
 * 
 * @example
 * <Heading level={1}>✨ Trove Design System</Heading>
 * <Heading level={2} variant="secondary" spacing="md">Find Your Data Gold</Heading>
 * <Heading level={3} weight="semibold" align="center">Section Title</Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ 
    children,
    className,
    level = 2,
    variant = 'default',
    weight = 'bold',
    align = 'left',
    muted = false,
    spacing = 'md',
    'data-testid': testId,
    ...props 
  }, ref) => {
    
    const headingClasses = cn(
      // Base styles - bold, rounded, modern per style guide
      'font-sans tracking-tight',
      
      // Level-specific responsive sizing
      levelVariants[level],
      
      // Color variant (muted overrides variant)
      muted ? colorVariants.muted : colorVariants[variant],
      
      // Font weight - headings default to bold
      weightVariants[weight],
      
      // Text alignment
      alignVariants[align],
      
      // Bottom spacing
      spacingVariants[spacing],
      
      // Custom classes
      className
    );

    // Create the appropriate heading element dynamically
    return React.createElement(
      `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
      {
        ref,
        className: headingClasses,
        'data-testid': testId,
        ...props,
      },
      children
    );
  }
);

Heading.displayName = 'Heading'; 