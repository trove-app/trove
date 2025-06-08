import React from 'react';
import NextLink from 'next/link';
import { cn } from '../utils/cn';
import { BaseComponentProps } from '../types';

export type LinkVariant = 
  | 'default'     // Primary color underline on hover
  | 'muted'       // Subtle color, no underline
  | 'gold'        // Gold color (primary brand)
  | 'brown'       // Brown color (secondary brand)
  | 'destructive' // Red for dangerous actions
  | 'button';     // Looks like a button

export type LinkSize = 'sm' | 'md' | 'lg';

export interface LinkProps extends BaseComponentProps {
  /** The URL the link points to */
  href: string;
  /** Visual variant of the link */
  variant?: LinkVariant;
  /** Size variant */
  size?: LinkSize;
  /** Whether the link is external (opens in new tab) */
  external?: boolean;
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Whether to show an underline by default */
  underline?: boolean;
  /** Whether to show an icon for external links */
  showExternalIcon?: boolean;
  /** Optional icon before the text */
  startIcon?: React.ReactNode;
  /** Optional icon after the text */
  endIcon?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Variant styles mapping
const variants = {
  default: 'text-primary-500 hover:text-primary-600 hover:underline underline-offset-4',
  muted: 'text-gray-500 hover:text-gray-600',
  gold: 'text-primary-500 hover:text-primary-600 hover:underline underline-offset-4',
  brown: 'text-secondary-500 hover:text-secondary-600 hover:underline underline-offset-4',
  destructive: 'text-red-500 hover:text-red-600 hover:underline underline-offset-4',
  button: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-500 text-primary-950 hover:bg-primary-600 font-medium'
} as const;

// Size styles mapping
const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
} as const;

// External link icon
const ExternalIcon = () => (
  <svg
    className="w-3.5 h-3.5 ml-1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className,
    href,
    variant = 'default',
    size = 'md',
    external = false,
    disabled = false,
    underline = false,
    showExternalIcon = true,
    startIcon,
    endIcon,
    children,
    onClick,
    ...props 
  }, ref) => {
    // Determine if the link is external based on the href or external prop
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    // Common props for both internal and external links
    const commonProps = {
      ref,
      className: cn(
        // Base styles
        'inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        
        // Variant styles
        variants[variant],
        
        // Size styles
        sizes[size],
        
        // Underline styles
        underline && 'underline underline-offset-4',
        
        // Disabled styles
        disabled && 'opacity-50 pointer-events-none',
        
        className
      ),
      onClick: disabled ? undefined : onClick,
      'aria-disabled': disabled,
      ...props
    };

    // Content with icons
    const content = (
      <>
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
        {isExternal && showExternalIcon && variant !== 'button' && <ExternalIcon />}
      </>
    );

    // Use Next Link for internal links, regular anchor for external
    if (isExternal) {
      return (
        <a
          {...commonProps}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <NextLink
        href={href}
        {...commonProps}
      >
        {content}
      </NextLink>
    );
  }
); 