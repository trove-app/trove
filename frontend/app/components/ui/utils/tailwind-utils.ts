// Shared Tailwind utility classes and component patterns
// Keep this light and iterate as we build components

// Base component patterns - common class combinations we'll likely reuse
export const componentBase = {
  // Focus styles for interactive elements
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  
  // Transition patterns
  transition: 'transition-colors duration-normal',
  
  // Common border radius (using our theme tokens)
  rounded: 'rounded-lg',
  
  // Disabled state
  disabled: 'disabled:pointer-events-none disabled:opacity-50',
} as const;

// Size patterns - we'll discover more as we build
export const sizePatterns = {
  sm: 'text-sm',
  md: 'text-base', 
  lg: 'text-lg',
} as const;

// Common layout patterns
export const layoutPatterns = {
  // Flex patterns we'll likely use
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexCol: 'flex flex-col',
  
  // Common spacing
  spacing: {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  },

  // Grid patterns
  grid2Cols: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  grid3Cols: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
} as const;

// Input state patterns - comprehensive states for form elements
export const inputStates = {
  // Base input styles
  base: [
    // Layout
    'w-full px-4 py-2 text-base',
    // Colors
    'bg-cream dark:bg-charcoal-black',
    'text-charcoal-black dark:text-cream',
    'border rounded-lg',
    // Placeholder
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    // Transitions
    'transition duration-200 ease-in-out',
  ].join(' '),

  // Interactive states
  interactive: {
    hover: 'hover:border-treasure-gold/50',
    focus: [
      'focus:outline-none focus:ring-2',
      'focus:border-treasure-gold focus:ring-treasure-gold/20',
    ].join(' '),
    active: 'active:border-treasure-gold active:ring-4',
    pressed: 'pressed:bg-treasure-gold/5',
  },

  // Validation states
  validation: {
    error: [
      'border-red-500',
      'focus:border-red-500',
      'focus:ring-red-500/20',
      'bg-red-50 dark:bg-red-900/10',
    ].join(' '),
    success: [
      'border-success-500',
      'focus:border-success-500',
      'focus:ring-success-500/20',
      'bg-success-50 dark:bg-success-900/10',
    ].join(' '),
    warning: [
      'border-warning-500',
      'focus:border-warning-500',
      'focus:ring-warning-500/20',
      'bg-warning-50 dark:bg-warning-900/10',
    ].join(' '),
  },

  // Loading state
  loading: [
    'opacity-70',
    'cursor-wait',
    'animate-pulse',
  ].join(' '),

  // Disabled state
  disabled: [
    'opacity-50',
    'cursor-not-allowed',
    'hover:border-inherit',
    'bg-gray-100 dark:bg-gray-800',
  ].join(' '),

  // Read-only state
  readOnly: [
    'bg-gray-50 dark:bg-gray-900',
    'cursor-default',
  ].join(' '),
} as const;

// Helper function to combine our patterns with custom classes
export function combinePatterns(...patterns: (string | undefined)[]) {
  return patterns.filter(Boolean).join(' ');
}

// TODO: Add more patterns as we discover them while building components
// - Button variants
// - Input states  
// - Card styles
// - Loading states 