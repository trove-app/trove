# Interactive Components Usage Patterns

This guide documents the interactive components in Trove's design system, focusing on the `Button`, `IconButton`, and `Link` components.

## Button Component

The `Button` component is our primary interactive component for triggering actions. It provides consistent styling and behavior across the application.

### Basic Usage

```tsx
import { Button } from '../components/ui';

// Default button
<Button variant="primary">Click me</Button>

// Different variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Action</Button>
<Button variant="link">Link-like Button</Button>

// Different sizes
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button (default)</Button>
<Button size="lg">Large Button</Button>
```

### Common Patterns

1. **Primary Actions**
```tsx
<Button variant="primary" size="lg">
  Save Changes
</Button>
```

2. **Secondary Actions**
```tsx
<Button variant="secondary" size="md">
  Cancel
</Button>
```

3. **Destructive Actions**
```tsx
<Button variant="destructive" size="md">
  Delete Item
</Button>
```

4. **Ghost Buttons (for subtle actions)**
```tsx
<Button variant="ghost" size="sm">
  Show More
</Button>
```

5. **Link-style Buttons**
```tsx
<Button variant="link" size="sm">
  Learn More
</Button>
```

### States and Props

```tsx
// Loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Cannot Click</Button>

// Full width
<Button fullWidth>Wide Button</Button>

// With icon
<Button startIcon={<Icon />}>With Icon</Button>
<Button endIcon={<Icon />}>With Icon</Button>
```

## IconButton Component

The `IconButton` component is designed for icon-only buttons with consistent sizing and interaction states.

### Basic Usage

```tsx
import { IconButton } from '../components/ui';

// Default icon button
<IconButton
  icon={<MenuIcon />}
  variant="ghost"
  size="md"
  aria-label="Toggle menu"
/>

// Different variants
<IconButton icon={<PlusIcon />} variant="primary" aria-label="Add item" />
<IconButton icon={<CloseIcon />} variant="destructive" aria-label="Close dialog" />
<IconButton icon={<EditIcon />} variant="outline" aria-label="Edit item" />
```

### Common Patterns

1. **Toggle Actions**
```tsx
<IconButton
  icon={isOpen ? <CloseIcon /> : <MenuIcon />}
  variant="ghost"
  aria-label={isOpen ? "Close menu" : "Open menu"}
/>
```

2. **Action Buttons**
```tsx
<IconButton
  icon={<TrashIcon />}
  variant="destructive"
  size="sm"
  aria-label="Delete item"
/>
```

3. **Toolbar Buttons**
```tsx
<div className="flex gap-2">
  <IconButton icon={<BoldIcon />} variant="ghost" aria-label="Bold text" />
  <IconButton icon={<ItalicIcon />} variant="ghost" aria-label="Italic text" />
  <IconButton icon={<UnderlineIcon />} variant="ghost" aria-label="Underline text" />
</div>
```

## Link Component

The `Link` component combines Next.js routing with consistent styling and behavior.

### Basic Usage

```tsx
import { Link } from '../components/ui';

// Default link
<Link href="/home">Home</Link>

// Different variants
<Link href="/docs" variant="primary">Documentation</Link>
<Link href="/settings" variant="muted">Settings</Link>
<Link href="/profile" variant="button">View Profile</Link>

// External links (automatically adds icon)
<Link href="https://example.com" external>
  External Website
</Link>
```

### Common Patterns

1. **Navigation Links**
```tsx
<Link 
  href="/dashboard" 
  variant="default"
  className="px-3 py-2 rounded-lg hover:bg-muted"
>
  Dashboard
</Link>
```

2. **Button-like Links**
```tsx
<Link
  href="/create"
  variant="button"
  className="px-4 py-2 bg-primary text-white rounded-lg"
>
  Create New
</Link>
```

3. **Subtle Links**
```tsx
<Link href="/terms" variant="muted" size="sm">
  Terms of Service
</Link>
```

## Best Practices

1. **Accessibility**
   - Always provide `aria-label` for IconButtons
   - Use semantic variants for different actions
   - Maintain sufficient color contrast
   - Provide clear hover/focus states

2. **Consistency**
   - Use appropriate variants for similar actions
   - Maintain consistent sizing within sections
   - Follow established patterns for common actions

3. **Responsive Design**
   - Consider touch targets on mobile
   - Use appropriate sizes for different screen sizes
   - Ensure hover states work on touch devices

4. **Performance**
   - Avoid unnecessary re-renders with memoization
   - Use appropriate Next.js Link features
   - Optimize icon imports

## Examples from Trove

### SQL Builder
```tsx
// Mode toggle buttons
<Button
  variant={mode === "written" ? "primary" : "ghost"}
  size="md"
  className={mode === "written" ? "shadow border border-primary" : ""}
>
  Written
</Button>

// Action button
<Button
  variant="primary"
  size="lg"
  onClick={runQuery}
  disabled={loading}
>
  {loading ? "Running..." : "Run Query"}
</Button>
```

### DB Explorer
```tsx
// Table selection button
<Button
  variant={selected ? "primary" : "ghost"}
  size="sm"
  className="w-full text-left justify-start"
>
  <span className="flex items-center">
    <span className="mr-2">🗄️</span>
    {tableName}
  </span>
</Button>
```

### Sidebar
```tsx
// Navigation link
<Link 
  href="/sql-builder" 
  variant="default"
  className="px-3 py-2 rounded-lg hover:bg-muted"
>
  <Text variant="interactive" weight="medium">
    🛠️ SQL Builder
  </Text>
</Link>

// Toggle button
<IconButton
  icon={isOpen ? <CloseIcon /> : <MenuIcon />}
  variant="ghost"
  size="lg"
  aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
/>
```

## Component Composition

Our interactive components are designed to work together seamlessly:

```tsx
// Combining buttons and icons
<Button
  variant="primary"
  startIcon={<SearchIcon />}
>
  Search
</Button>

// Links that look like buttons
<Link
  href="/create"
  variant="button"
  className="inline-flex items-center"
>
  <PlusIcon className="mr-2" />
  Create New
</Link>

// IconButton in a button group
<div className="flex gap-1 p-1 bg-muted rounded-lg">
  <IconButton icon={<ListIcon />} variant="ghost" aria-label="List view" />
  <IconButton icon={<GridIcon />} variant="ghost" aria-label="Grid view" />
</div>
```

*"Interactive elements should feel like treasure - delightful to discover and satisfying to use."* ✨ 