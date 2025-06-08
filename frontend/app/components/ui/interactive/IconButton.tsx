import React from 'react';
import { cn } from '../utils/cn';
import { componentBase } from '../utils/tailwind-utils';
import { BaseComponentProps } from '../types';
import { ButtonVariant } from './Button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends BaseComponentProps {
  /** The icon to display */
  icon: React.ReactNode;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size variant */
  size?: IconButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Accessible label for the button */
  'aria-label': string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Variant styles mapping - reuse button variants but adjust padding
const variants = {
  primary: 'bg-primary-500 text-primary-950 hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-secondary-500 text-secondary-950 hover:bg-secondary-600 active:bg-secondary-700',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  link: 'text-primary-500 hover:underline underline-offset-4 hover:text-primary-600'
} as const;

// Size styles mapping - square dimensions for icon buttons
const sizes = {
  sm: 'h-8 w-8 p-1.5',
  md: 'h-10 w-10 p-2',
  lg: 'h-12 w-12 p-2.5'
} as const;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    icon,
    type = 'button',
    'aria-label': ariaLabel,
    onClick,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg',
          componentBase.transition,
          componentBase.focus,
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // State styles
          'disabled:opacity-50 disabled:pointer-events-none',
          isLoading && 'opacity-80 cursor-wait',
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            style={{ 
              width: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : '1.5rem',
              height: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : '1.5rem'
            }}
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
        ) : (
          icon
        )}
      </button>
    );
  }
); 