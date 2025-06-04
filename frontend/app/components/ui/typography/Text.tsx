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

// Color variant styles based on Trove brand colors
const colorVariants = {
  default: 'text-foreground',              // Uses theme foreground color
  primary: 'text-foreground',              // Uses theme foreground color  
  secondary: 'text-secondary-600',         // Chest Brown from theme
  success: 'text-success-600',            // Success color from theme
  warning: 'text-warning-500',            // Treasure Gold from theme
  error: 'text-error-600',                // Error color from theme
  info: 'text-info-600',                  // Info color from theme
  muted: 'text-muted-foreground',         // Muted color from theme
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