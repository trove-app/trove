import React from 'react';
import { cn } from '../utils/cn';
import { BaseComponentProps, SizeVariant, ColorVariant } from '../types';

// Text-specific props
export interface TextProps extends BaseComponentProps {
  /** Size variant for the text */
  size?: SizeVariant;
  /** Color variant for the text */
  variant?: ColorVariant | 'default';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether text should be muted/secondary */
  muted?: boolean;
  /** HTML element to render as */
  as?: 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// Size variant styles using Tailwind classes
const sizeVariants = {
  xs: 'text-xs leading-4',      // 12px
  sm: 'text-sm leading-5',      // 14px  
  md: 'text-base leading-6',    // 16px (default)
  lg: 'text-lg leading-7',      // 18px
  xl: 'text-xl leading-8',      // 20px
};

// Color variant styles based on Trove brand colors and data contexts
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
  
  // Legacy/backward compatibility
  secondary: 'text-secondary-600 dark:text-secondary-400',  // Chest Brown from theme
  
  // Data-specific semantic colors
  metric: 'text-primary-600 dark:text-primary-400',     // Key metrics/KPIs
  insight: 'text-secondary-600 dark:text-secondary-400', // Data insights
  nugget: 'text-primary-500 font-medium',               // Data nuggets (special!)
  
  // Interactive states
  interactive: 'text-foreground hover:text-primary-600 transition-colors',
  link: 'text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline',
  
  // Light variants for subtlety
  light: 'text-foreground/70',
  lighter: 'text-foreground/50',
};

// Font weight styles
const weightVariants = {
  normal: 'font-normal',
  medium: 'font-medium', 
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Text alignment styles
const alignVariants = {
  left: 'text-left',
  center: 'text-center', 
  right: 'text-right',
};

/**
 * Text component for body text and general typography
 * 
 * Follows Trove style guide with friendly, readable typography
 * Uses Tailwind classes for consistent styling
 * 
 * @example
 * <Text size="lg" weight="medium">Welcome to Trove</Text>
 * <Text variant="secondary" muted>Find your data gold</Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    children,
    className,
    size = 'md',
    variant = 'default',
    weight = 'normal',
    align = 'left',
    muted = false,
    as: Component = 'p',
    'data-testid': testId,
    ...props 
  }, ref) => {
    
    const textClasses = cn(
      // Base styles - friendly, readable typography
      'font-sans tracking-normal',
      
      // Size variant
      sizeVariants[size],
      
      // Color variant (muted overrides variant)
      muted ? colorVariants.muted : colorVariants[variant],
      
      // Font weight
      weightVariants[weight],
      
      // Text alignment
      alignVariants[align],
      
      // Custom classes
      className
    );

    return (
      <Component
        ref={ref as any}
        className={textClasses}
        data-testid={testId}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text'; 