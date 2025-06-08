import React from 'react';
import { cn } from '../utils/cn';
import { inputStates } from '../utils/tailwind-utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Optional label for the input
   */
  label?: string;
  /**
   * Optional helper text below the input
   */
  helperText?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the input is in an error state
   */
  isError?: boolean;
  /**
   * Whether the input is in a success state
   */
  isSuccess?: boolean;
  /**
   * Whether the input is in a warning state
   */
  isWarning?: boolean;
  /**
   * Whether the input is in a loading state
   */
  isLoading?: boolean;
  /**
   * Custom classes to apply to the input wrapper
   */
  wrapperClassName?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
} as const;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    label,
    helperText,
    error,
    isError,
    isSuccess,
    isWarning,
    isLoading,
    wrapperClassName,
    disabled,
    size = 'md',
    type = 'text',
    value,
    ...props 
  }, ref) => {
    // Determine validation state
    const validationState = isError ? 'error' : isSuccess ? 'success' : isWarning ? 'warning' : null;

    // Handle number type
    const inputValue = type === 'number' && typeof value === 'number' ? value.toString() : value;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block mb-2 text-sm font-medium text-charcoal-black dark:text-cream"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          value={inputValue}
          disabled={disabled || isLoading}
          className={cn(
            // Base styles
            inputStates.base,
            sizeStyles[size],
            
            // Interactive states
            !disabled && !isLoading && [
              inputStates.interactive.hover,
              inputStates.interactive.focus,
              inputStates.interactive.active,
              inputStates.interactive.pressed,
            ],
            
            // Validation states
            validationState && inputStates.validation[validationState],
            
            // Loading state
            isLoading && inputStates.loading,
            
            // Disabled state
            disabled && inputStates.disabled,
            
            className
          )}
          {...props}
        />
        
        {(helperText || error) && (
          <p 
            className={cn(
              "mt-2 text-sm",
              error 
                ? "text-red-500" 
                : isSuccess
                ? "text-success-600 dark:text-success-400"
                : isWarning
                ? "text-warning-600 dark:text-warning-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 