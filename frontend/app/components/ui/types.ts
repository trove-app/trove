// Shared TypeScript types and interfaces for UI components

import { ReactNode, HTMLAttributes } from 'react';

// Base component props that all UI components should extend
export interface BaseComponentProps {
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: ReactNode;
  /** Test ID for testing */
  'data-testid'?: string;
}

// Size variants used across components
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants based on our theme and data exploration contexts
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'muted'
  // Brand colors
  | 'gold'
  | 'brown'
  // Semantic variants
  | 'subtle'
  | 'accent'
  // Data-specific variants
  | 'metric'
  | 'insight'
  | 'nugget'
  // Interactive variants
  | 'interactive'
  | 'link'
  // Light variants
  | 'light'
  | 'lighter';

// Button variants
export type ButtonVariant = 
  | 'default' 
  | 'destructive' 
  | 'outline' 
  | 'secondary' 
  | 'ghost' 
  | 'link';

// Typography variants
export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'body' 
  | 'caption' 
  | 'code';

// Common HTML element props
export type DivProps = HTMLAttributes<HTMLDivElement>;
export type ButtonProps = HTMLAttributes<HTMLButtonElement>;
export type InputProps = HTMLAttributes<HTMLInputElement>;
export type AnchorProps = HTMLAttributes<HTMLAnchorElement>;

// Utility type for component variants
export type VariantProps<T extends Record<string, any>> = {
  [K in keyof T]?: keyof T[K];
}; 