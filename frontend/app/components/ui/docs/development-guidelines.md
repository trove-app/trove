# 🛠️ Trove Component Development Guidelines

*Tailwind v4-focused development patterns for the Trove UI library*

---

## 🎯 Core Principles

### 1. Tailwind v4 First
- **Use `@theme` directive** - All customizations go in `globals.css` using `@theme`
- **Leverage CSS custom properties** - Tailwind v4 generates CSS variables automatically
- **Semantic color tokens** - Use `bg-primary-500` not `bg-yellow-400`
- **Theme-aware utilities** - Colors adapt to light/dark mode automatically

### 2. Component Architecture
```tsx
// ✅ Good: Tailwind-first with semantic tokens
function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        // Base styles using theme tokens
        'inline-flex items-center justify-center font-medium',
        'rounded-lg transition-colors duration-normal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        
        // Size variants
        { 'h-8 px-3 text-sm': size === 'sm' },
        { 'h-10 px-4 text-base': size === 'md' },
        
        // Color variants using theme
        { 'bg-primary-500 text-primary-950 hover:bg-primary-600': variant === 'primary' },
        { 'bg-secondary-500 text-secondary-950 hover:bg-secondary-600': variant === 'secondary' },
        
        className
      )}
      {...props}
    />
  );
}
```

---

## 🎨 Tailwind v4 Patterns

### Using @theme Configuration
```css
/* globals.css - Define once, use everywhere */
@theme {
  --color-primary-500: #F4B100;
  --color-primary-600: #E6A000;
  --color-primary-950: #2A2A2A;
  
  --radius-lg: 0.5rem;
  --shadow-soft: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

```tsx
// Components automatically use theme values
className="bg-primary-500 rounded-lg shadow-soft"
```

### Dark Mode with @media
```tsx
// ✅ Automatic dark mode via CSS @media
className="bg-background text-foreground"
// No need for dark: prefixes - handled in @theme
```

### Shared Pattern Usage
```tsx
import { cn, componentBase, layoutPatterns } from '../utils';

// Combine shared patterns with component-specific styles
className={cn(
  componentBase.focus,      // Standard focus ring
  componentBase.transition, // Consistent transitions
  layoutPatterns.flexCenter, // Common layout
  'bg-primary-500 hover:bg-primary-600' // Component-specific
)}
```

---

## 📝 Component Development Workflow

### 1. Plan Component Structure
```tsx
// Define props interface first
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

### 2. Build with Tailwind Classes
```tsx
// Use semantic theme tokens
'bg-primary-500 text-primary-950'  // ✅ Theme-aware
'bg-yellow-400 text-gray-900'      // ❌ Hard-coded colors
```

### 3. Extract Patterns
```tsx
// If you repeat classes, add to tailwind-utils.ts
export const buttonPatterns = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg',
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
} as const;
```

### 4. Test Responsiveness
```tsx
// Mobile-first responsive design
className="text-sm md:text-base lg:text-lg"
className="p-2 md:p-4 lg:p-6"
```

---

## 🔧 Best Practices

### Class Organization
```tsx
className={cn(
  // 1. Layout & positioning
  'flex items-center justify-center',
  
  // 2. Sizing
  'h-10 px-4',
  
  // 3. Typography
  'text-base font-medium',
  
  // 4. Colors & backgrounds
  'bg-primary-500 text-primary-950',
  
  // 5. Borders & effects
  'rounded-lg shadow-soft',
  
  // 6. States & interactions
  'hover:bg-primary-600 focus-visible:ring-2',
  
  // 7. Responsive variants
  'md:h-12 md:px-6',
  
  // 8. Custom overrides
  className
)}
```

### Variant Patterns
```tsx
// ✅ Use objects for clean variant mapping
const variants = {
  primary: 'bg-primary-500 text-primary-950 hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-secondary-950 hover:bg-secondary-600',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
} as const;

className={cn(variants[variant], className)}
```

### Conditional Styling
```tsx
// ✅ Use cn() for conditional classes
className={cn(
  'base-styles',
  {
    'active-styles': isActive,
    'disabled-styles': disabled,
  },
  className
)}
```

---

## 🚫 Common Pitfalls

### ❌ Avoid These Patterns
```tsx
// Don't use arbitrary values when theme tokens exist
'bg-[#F4B100]'              // ❌ Use 'bg-primary-500'
'rounded-[8px]'             // ❌ Use 'rounded-lg'

// Don't hardcode dark mode
'bg-white dark:bg-gray-900' // ❌ Use 'bg-background'

// Don't create overly complex variants
variant?: 'primary' | 'secondary' | 'primaryLarge' | 'primarySmall' | ...
// ❌ Use separate size prop instead
```

### ✅ Do This Instead
```tsx
// Use theme tokens
'bg-primary-500 rounded-lg'

// Use semantic colors
'bg-background text-foreground'

// Separate concerns
variant?: 'primary' | 'secondary';
size?: 'sm' | 'md' | 'lg';
```

---

## 🧪 Testing Components

### Visual Testing Checklist
- [ ] Light mode appearance
- [ ] Dark mode appearance (automatic via @media)
- [ ] All variant combinations
- [ ] Responsive behavior
- [ ] Focus states
- [ ] Hover states
- [ ] Disabled states

### Integration Testing
```tsx
// Test with different prop combinations
<Button variant="primary" size="sm" />
<Button variant="outline" size="lg" disabled />
<Button className="custom-override" />
```

---

## 📚 Resources

- [Tailwind v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Trove Theme Configuration](../../../globals.css)
- [Shared Utility Patterns](../utils/tailwind-utils.ts)
- [Component Type Definitions](../types.ts)

---

*Build components that feel like treasure - polished, valuable, and delightful to use.* ✨ 