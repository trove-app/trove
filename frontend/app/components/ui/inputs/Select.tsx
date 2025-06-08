import React from 'react';
import { cn } from '../utils/cn';
import { inputStates } from '../utils/tailwind-utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  /**
   * Options for the select
   */
  options: SelectOption[];
  /**
   * Optional label for the select
   */
  label?: string;
  /**
   * Optional helper text below the select
   */
  helperText?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the select is in an error state
   */
  isError?: boolean;
  /**
   * Whether the select is in a success state
   */
  isSuccess?: boolean;
  /**
   * Whether the select is in a warning state
   */
  isWarning?: boolean;
  /**
   * Whether the select is in a loading state
   */
  isLoading?: boolean;
  /**
   * Custom classes to apply to the select wrapper
   */
  wrapperClassName?: string;
  /**
   * Optional placeholder text
   */
  placeholder?: string;
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
    options,
    placeholder,
    size = 'md',
    ...props 
  }, ref) => {
    // Determine validation state
    const validationState = isError ? 'error' : isSuccess ? 'success' : isWarning ? 'warning' : null;

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
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
              // Base styles
              inputStates.base,
              sizeStyles[size],
              'appearance-none pr-10', // Extra padding for the chevron
              
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
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom chevron icon */}
          <div className={cn(
            "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none",
            disabled && "opacity-50"
          )}>
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        
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

Select.displayName = 'Select'; 