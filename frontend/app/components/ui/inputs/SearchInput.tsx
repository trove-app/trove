import React from 'react';
import { cn } from '../utils/cn';
import { Input, InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  /**
   * Callback when the clear button is clicked
   */
  onClear?: () => void;
  /**
   * Whether to show the clear button
   */
  showClear?: boolean;
  /**
   * Custom search icon component
   */
  searchIcon?: React.ReactNode;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    className,
    wrapperClassName,
    onClear,
    showClear = true,
    searchIcon,
    value,
    onChange,
    disabled,
    ...props 
  }, ref) => {
    // Default search icon if none provided
    const defaultSearchIcon = (
      <svg
        className="w-4 h-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    );

    // Clear button icon
    const clearIcon = (
      <svg
        className="w-4 h-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create a synthetic event to clear the input
        const event = {
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className={cn("relative", wrapperClassName)}>
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {searchIcon || defaultSearchIcon}
        </div>

        {/* Input */}
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'pl-10', // Space for search icon
            showClear && value && 'pr-10', // Space for clear button
            className
          )}
          {...props}
        />

        {/* Clear Button */}
        {showClear && value && !disabled && (
          <button
            type="button"
            className={cn(
              'absolute inset-y-0 right-0 pr-3 flex items-center',
              'hover:opacity-75 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
            )}
            onClick={handleClear}
            aria-label="Clear search"
          >
            {clearIcon}
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput'; 