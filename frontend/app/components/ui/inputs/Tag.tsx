import React from 'react';
import { cn } from '../utils/cn';

export type TagVariant = 
  | 'default'
  | 'gold'    // Treasure Gold - primary
  | 'brown'   // Chest Brown - secondary
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'metric'
  | 'insight'
  | 'nugget';

export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the tag
   */
  variant?: TagVariant;
  /**
   * Size variant
   */
  size?: TagSize;
  /**
   * Whether the tag is removable
   */
  removable?: boolean;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Whether the tag is selected (for interactive tags)
   */
  selected?: boolean;
  /**
   * Whether the tag is interactive (clickable)
   */
  interactive?: boolean;
  /**
   * Optional icon to display before the text
   */
  icon?: React.ReactNode;
  /**
   * Whether the tag is disabled
   */
  disabled?: boolean;
}

const variantStyles: Record<TagVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  gold: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  brown: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
  error: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
  info: 'bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-300',
  metric: 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400',
  insight: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-900/50 dark:text-secondary-400',
  nugget: 'bg-primary-100 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200',
};

const sizeStyles: Record<TagSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    removable = false,
    onRemove,
    selected = false,
    interactive = false,
    icon,
    disabled = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && interactive && onClick) {
        onClick(e);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && onRemove) {
        onRemove();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
          'border border-transparent',
          
          // Variant styles
          variantStyles[variant],
          
          // Size styles
          sizeStyles[size],
          
          // Interactive styles
          interactive && !disabled && 'cursor-pointer hover:bg-opacity-80',
          
          // Selected styles
          selected && [
            'ring-2',
            'ring-primary-500/20',
            'border-primary-500',
          ],
          
          // Disabled styles
          disabled && 'opacity-50 cursor-not-allowed',
          
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span className="shrink-0">
            {icon}
          </span>
        )}
        
        {/* Content */}
        <span className="truncate">
          {children}
        </span>
        
        {/* Remove button */}
        {removable && !disabled && (
          <button
            type="button"
            className={cn(
              'shrink-0 rounded-full p-0.5',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-colors'
            )}
            onClick={handleRemove}
            aria-label="Remove tag"
          >
            <svg
              className="w-3 h-3 opacity-50 hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = 'Tag'; 