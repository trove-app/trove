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
  
  // Common spacing
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2', 
    md: 'gap-4',
    lg: 'gap-6',
  },
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