import React from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
   * Custom classes to apply to the input wrapper
   */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    label,
    helperText,
    error,
    isError,
    wrapperClassName,
    disabled,
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
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            "w-full px-4 py-2 text-base transition duration-200 ease-in-out",
            "bg-cream dark:bg-charcoal-black",
            "text-charcoal-black dark:text-cream",
            "border rounded-lg",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            
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
        />
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

Input.displayName = 'Input'; 