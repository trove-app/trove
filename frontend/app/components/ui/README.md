# 🎨 Trove UI Component Library

A comprehensive, Tailwind-first component library for the Trove data exploration platform.

## 📁 Directory Structure

```
ui/
├── README.md                 # This file
├── index.ts                  # Main export file
├── types.ts                  # Shared TypeScript types
├── typography/               # Text and heading components
│   └── index.ts
├── inputs/                   # Form input components
│   └── index.ts
├── interactive/              # Buttons, links, and interactive elements
│   └── index.ts
├── layout/                   # Containers, grids, and layout components
│   └── index.ts
├── data-display/             # Tables, status indicators, loading states
│   └── index.ts
└── utils/                    # Utility functions and helpers
    ├── index.ts
    ├── cn.ts                 # Class name utility
    └── tailwind-utils.ts     # Shared Tailwind patterns
```

## 🚀 Quick Start

### Importing Components

```tsx
// Import specific components
import { Button, Input, Card } from '@/app/components/ui';

// Import from specific categories
import { Text, Heading } from '@/app/components/ui/typography';
import { cn, componentBase, layoutPatterns } from '@/app/components/ui/utils';
```

### Using the Class Name Utility

```tsx
import { cn } from '@/app/components/ui/utils';

function MyComponent({ className, isActive }) {
  return (
    <div className={cn(
      'px-4 py-2 rounded-lg', // base styles
      'bg-background text-foreground', // theme-aware colors
      { 'bg-primary-500': isActive }, // conditional styles
      className // allow override
    )}>
      Content
    </div>
  );
}
```

### Using Shared Tailwind Patterns

```tsx
import { cn, componentBase, layoutPatterns } from '@/app/components/ui/utils';

function InteractiveCard({ children, onClick }) {
  return (
    <div 
      className={cn(
        componentBase.rounded,
        componentBase.transition,
        componentBase.focus,
        layoutPatterns.flexCenter,
        'bg-card border border-border p-4 cursor-pointer hover:bg-accent'
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

## 🎯 Design Principles

### 1. Tailwind-First Approach
- Use Tailwind utility classes for all styling
- Leverage our custom `@theme` configuration
- Minimal custom CSS - only when absolutely necessary

### 2. Theme-Aware Components
- Use semantic color tokens (`bg-primary-500`, `text-foreground`)
- Support automatic dark mode via `@media (prefers-color-scheme: dark)`
- Follow the Trove brand identity (treasure gold, cream backgrounds)

### 3. TypeScript-First Development
- All components have proper TypeScript interfaces
- Extend base component props for consistency
- Use discriminated unions for variant props

### 4. Composition Over Configuration
- Small, focused components that compose well
- Consistent prop patterns across components
- Flexible but opinionated defaults

## 🧩 Component Categories

### Typography (`/typography`)
Text rendering components with consistent sizing and theming.
- `Text` - Base text component with size variants
- `Heading` - Semantic heading components (h1-h6)
- `CodeBlock` - Code display with syntax highlighting

### Inputs (`/inputs`)
Form input components with validation and theming.
- `Input` - Base text input with states
- `Select` - Dropdown selection component
- `Tag` - Tag/pill components for selections
- `SearchInput` - Search input with icon support

### Interactive (`/interactive`)
Clickable elements and navigation components.
- `Button` - Primary action buttons with variants
- `IconButton` - Icon-only button component
- `Link` - Themed link component with states

### Layout (`/layout`)
Structural components for page and content layout.
- `Container` - Content width constraints
- `Grid` - Responsive grid system
- `Card` - Content cards with variants

### Data Display (`/data-display`)
Components for displaying data and states.
- `Table` - Styled table wrapper for mantine-react-table
- `StatusBadge` - Status indicators and badges
- `LoadingSpinner` - Loading state components

## 🛠️ Development Guidelines

### Creating New Components

1. **Choose the right category** - Place components in the appropriate directory
2. **Follow naming conventions** - Use PascalCase for components, camelCase for props
3. **Extend base props** - Use `BaseComponentProps` interface
4. **Use the `cn` utility** - For combining class names
5. **Leverage shared patterns** - Use `componentBase`, `layoutPatterns`, etc. when applicable
6. **Support variants** - Use discriminated unions for component variants
7. **Add TypeScript docs** - Document props with JSDoc comments
8. **Iterate on patterns** - Add new patterns to `tailwind-utils.ts` as you discover them

### Using Shared Patterns

```tsx
import { cn, componentBase, layoutPatterns } from '../utils';

// Use shared patterns for consistency
className={cn(
  componentBase.focus,      // Standard focus styles
  componentBase.transition, // Standard transitions
  layoutPatterns.flexCenter, // Common flex pattern
  'custom-specific-styles'   // Component-specific styles
)}
```

### Adding New Patterns

When you find yourself repeating Tailwind classes, add them to `tailwind-utils.ts`:

```tsx
// In tailwind-utils.ts
export const buttonPatterns = {
  base: 'inline-flex items-center justify-center font-medium',
  primary: 'bg-primary-500 text-primary-950 hover:bg-primary-600',
  // ... discovered through building actual buttons
} as const;
```

## 🎨 Theming

All components use our custom Tailwind theme defined in `app/globals.css`. Key theme tokens:

- **Colors**: `primary-*`, `secondary-*`, `background`, `foreground`, `muted-*`
- **Spacing**: Standard Tailwind scale plus custom values
- **Radius**: `radius-sm`, `radius`, `radius-lg`, `radius-xl`, `radius-2xl`
- **Shadows**: `shadow-soft`, `shadow-glow`, `shadow-treasure`, `shadow-depth`

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Trove Theme Customization Guide](../../../../docs/theme-customization.md)
- [Trove Style Guide](../../../../assets/style-guide.md)

---

*"Build components that sparkle with Trove's golden touch."* ✨ 