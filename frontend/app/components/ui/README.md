# Trove UI Components

This directory contains all the shared UI components for the Trove design system.

## Directory Structure

- `typography/` - Text components (headings, body text, code blocks)
- `inputs/` - Form elements (text inputs, selects, pills)
- `layout/` - Layout components (containers, grids, cards)
- `interactive/` - Interactive elements (buttons, links)
- `data-display/` - Data visualization components (tables, status indicators)

## Usage Guidelines

1. Each component should:
   - Be in its own directory
   - Have a clear, single responsibility
   - Include TypeScript types
   - Use theme variables via CSS custom properties
   - Support dark mode
   - Include proper accessibility attributes

2. File Structure:
   ```
   component-name/
   ├── index.tsx        # Main component
   ├── types.ts         # TypeScript types
   └── styles.css       # Component-specific styles (if needed)
   ```

3. Component Template:
   ```tsx
   import { ComponentProps } from './types';
   
   export function ComponentName({ prop1, prop2, ...props }: ComponentProps) {
     return (
       // JSX
     );
   }
   ```

4. Importing Components:
   ```tsx
   import { ComponentName } from '@/components/ui/component-category';
   ```

## Theme Usage

Components should use the theme system via CSS custom properties or Tailwind classes:

```tsx
// Using CSS custom properties
<div className="bg-background text-foreground" />

// Using theme utilities
<div style={{ color: getThemeColor(theme, mode, 'primary') }} />
``` 