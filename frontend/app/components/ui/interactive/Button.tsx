import React from 'react';
import { cn } from '../utils/cn';
import { componentBase } from '../utils/tailwind-utils';
import { BaseComponentProps } from '../types';

export type ButtonVariant = 
  | 'primary'    // Gold - main CTA
  | 'secondary'  // Brown - alternative actions
  | 'outline'    // Bordered - subtle actions
  | 'ghost'      // Minimal - menu items
  | 'destructive' // Red - dangerous actions
  | 'link';      // Looks like a link

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Optional icon before the text */
  startIcon?: React.ReactNode;
  /** Optional icon after the text */
  endIcon?: React.ReactNode;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Variant styles mapping
const variants = {
  primary: 'bg-primary-500 text-primary-950 hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-secondary-500 text-secondary-950 hover:bg-secondary-600 active:bg-secondary-700',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  link: 'text-primary-500 hover:underline underline-offset-4 hover:text-primary-600'
} as const;

// Size styles mapping
const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg'
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    startIcon,
    endIcon,
    fullWidth = false,
    type = 'button',
    children,
    onClick,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-lg',
          componentBase.transition,
          componentBase.focus,
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Width styles
          fullWidth ? 'w-full' : 'w-auto',
          
          // State styles
          'disabled:opacity-50 disabled:pointer-events-none',
          isLoading && 'opacity-80 cursor-wait',
          
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Start icon */}
        {!isLoading && startIcon && (
          <span className="mr-2 -ml-1">{startIcon}</span>
        )}
        
        {/* Content */}
        {children}
        
        {/* End icon */}
        {!isLoading && endIcon && (
          <span className="ml-2 -mr-1">{endIcon}</span>
        )}
      </button>
    );
  }
); 