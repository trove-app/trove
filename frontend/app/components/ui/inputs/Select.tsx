import React from 'react';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
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
   * Custom classes to apply to the select wrapper
   */
  wrapperClassName?: string;
  /**
   * Optional placeholder text
   */
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className,
    label,
    helperText,
    error,
    isError,
    wrapperClassName,
    disabled,
    options,
    placeholder,
    ...props 
  }, ref) => {
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
            disabled={disabled}
            className={cn(
              // Base styles
              "w-full px-4 py-2 text-base transition duration-200 ease-in-out appearance-none",
              "bg-cream dark:bg-charcoal-black",
              "text-charcoal-black dark:text-cream",
              "border rounded-lg",
              "pr-10", // Extra padding for the chevron
              
              // Focus styles
              "focus:outline-none focus:ring-2",
              "focus:border-treasure-gold focus:ring-treasure-gold/20",
              
              // Hover styles
              "hover:border-treasure-gold/50",
              
              // Disabled styles
              disabled && "opacity-50 cursor-not-allowed hover:border-inherit",
              
              // Error styles
              isError && [
                "border-red-500",
                "focus:border-red-500",
                "focus:ring-red-500/20",
              ],
              
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
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
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