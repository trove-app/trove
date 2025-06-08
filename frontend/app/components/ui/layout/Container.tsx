import React from 'react';
import { cn } from '../utils/cn';
import { BaseComponentProps } from '../types';

export interface ContainerProps extends BaseComponentProps {
  /** Maximum width constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'min' | 'max' | 'prose' | 'screen-sm' | 'screen-md' | 'screen-lg' | 'screen-xl' | 'screen-2xl';
  /** Whether to center the container horizontally */
  centered?: boolean;
  /** Whether to add default padding */
  padded?: boolean;
  /** Whether to add default margin */
  spaced?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  min: 'max-w-min',
  max: 'max-w-max',
  prose: 'max-w-prose',
  'screen-sm': 'max-w-screen-sm',
  'screen-md': 'max-w-screen-md',
  'screen-lg': 'max-w-screen-lg',
  'screen-xl': 'max-w-screen-xl',
  'screen-2xl': 'max-w-screen-2xl',
} as const;

/**
 * Container component for consistent width constraints and padding
 * 
 * @example
 * <Container maxWidth="7xl" padded>
 *   <Content />
 * </Container>
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    children,
    className,
    maxWidth = '7xl',
    centered = true,
    padded = true,
    spaced = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Max width constraint
          maxWidthClasses[maxWidth],
          
          // Horizontal centering
          centered && 'mx-auto',
          
          // Default padding - responsive
          padded && 'px-4 sm:px-6 lg:px-8',
          
          // Optional vertical margin
          spaced && 'my-8',
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
); 