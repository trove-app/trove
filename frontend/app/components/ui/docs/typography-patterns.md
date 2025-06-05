# Typography Usage Patterns

This guide documents the typography patterns used in Trove's design system, focusing on the `Text` and `Heading` components.

## Text Component

The `Text` component is our primary typography component for body text and general content. It provides a consistent way to style text across the application.

### Basic Usage

```tsx
import { Text } from '../components/ui';

// Default body text
<Text>Regular body text</Text>

// Different sizes
<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="md">Medium text (default)</Text>
<Text size="lg">Large text</Text>
<Text size="xl">Extra large text</Text>
```

### Color Variants

```tsx
// Brand colors
<Text variant="primary">Primary text</Text>
<Text variant="gold">Gold accent text</Text>
<Text variant="brown">Brown accent text</Text>

// Status colors
<Text variant="success">Success message</Text>
<Text variant="warning">Warning message</Text>
<Text variant="error">Error message</Text>
<Text variant="info">Information message</Text>

// Semantic colors
<Text variant="muted">Muted secondary text</Text>
<Text variant="subtle">Even more subtle text</Text>
<Text variant="accent">Accent text</Text>

// Data-specific colors
<Text variant="metric">Metric value text</Text>
<Text variant="insight">Data insight text</Text>
<Text variant="nugget">Data nugget text</Text>

// Interactive states
<Text variant="interactive">Interactive text</Text>
<Text variant="link">Link text</Text>

// Light variants
<Text variant="light">Light text</Text>
<Text variant="lighter">Even lighter text</Text>
```

### Font Weights

```tsx
<Text weight="normal">Normal weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold weight</Text>
<Text weight="bold">Bold weight</Text>
```

### Text Alignment

```tsx
<Text align="left">Left-aligned text</Text>
<Text align="center">Centered text</Text>
<Text align="right">Right-aligned text</Text>
```

### Common Patterns

1. **Form Labels**
```tsx
<Text as="label" weight="semibold" variant="primary">Field Label</Text>
```

2. **Helper Text**
```tsx
<Text size="sm" variant="muted">Additional information or help text</Text>
```

3. **Error Messages**
```tsx
<Text variant="error" weight="semibold">Error: Something went wrong</Text>
```

4. **Data Values**
```tsx
<Text variant="metric" weight="semibold">1,234</Text>
<Text variant="insight" size="sm">Increased by 20%</Text>
```

## Heading Component

The `Heading` component is used for section titles and content hierarchy. It provides consistent heading styles across the application.

### Basic Usage

```tsx
import { Heading } from '../components/ui';

// Different levels
<Heading level={1}>Main Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection Title</Heading>
<Heading level={4}>Small Section Title</Heading>
<Heading level={5}>Minor Section Title</Heading>
<Heading level={6}>Smallest Section Title</Heading>
```

### Color Variants

```tsx
// Brand colors
<Heading variant="primary">Primary heading</Heading>
<Heading variant="gold">Gold accent heading</Heading>
<Heading variant="brown">Brown accent heading</Heading>

// Status colors
<Heading variant="success">Success section</Heading>
<Heading variant="warning">Warning section</Heading>
<Heading variant="error">Error section</Heading>
<Heading variant="info">Information section</Heading>

// Data-specific colors
<Heading variant="metric">Metrics Section</Heading>
<Heading variant="insight">Insights Section</Heading>
<Heading variant="nugget">Data Nuggets</Heading>
```

### Font Weights

```tsx
<Heading weight="medium">Medium weight</Heading>
<Heading weight="semibold">Semibold weight</Heading>
<Heading weight="bold">Bold weight (default)</Heading>
<Heading weight="extrabold">Extra bold weight</Heading>
```

### Spacing

```tsx
<Heading spacing="none">No bottom margin</Heading>
<Heading spacing="sm">Small bottom margin</Heading>
<Heading spacing="md">Medium bottom margin (default)</Heading>
<Heading spacing="lg">Large bottom margin</Heading>
```

### Common Patterns

1. **Page Titles**
```tsx
<Heading level={1} variant="primary" spacing="lg">Page Title</Heading>
```

2. **Section Headers**
```tsx
<Heading level={2} variant="gold" spacing="md">Section Title</Heading>
```

3. **Data Section Headers**
```tsx
<Heading level={3} variant="metric" weight="semibold">Metrics Overview</Heading>
```

4. **Card Headers**
```tsx
<Heading level={4} variant="primary" spacing="sm">Card Title</Heading>
```

## Best Practices

1. **Hierarchy**
   - Use appropriate heading levels (h1-h6) to maintain semantic structure
   - Don't skip heading levels (e.g., don't jump from h1 to h4)
   - Use only one h1 per page

2. **Consistency**
   - Use consistent color variants for similar types of content
   - Maintain consistent spacing patterns between sections
   - Use appropriate font weights for visual hierarchy

3. **Accessibility**
   - Ensure sufficient color contrast for all text variants
   - Maintain readable font sizes (especially for body text)
   - Use semantic heading levels for proper document structure

4. **Responsive Design**
   - Headings automatically scale based on screen size
   - Consider using smaller text sizes on mobile devices
   - Ensure text remains readable at all breakpoints

## Examples from Trove

### DB Explorer
```tsx
// Table listing
<Heading level={2} variant="primary" spacing="md">
  🗄️ Database Tables
</Heading>

// Table details
<Text variant="muted">Columns:</Text>
<Text variant="primary" className="font-mono">{columnName}</Text>
<Text size="xs" variant="muted">({dataType})</Text>
```

### SQL Builder
```tsx
// Query editor
<Text weight="semibold" variant="primary">SQL Query Editor</Text>

// Results section
<Text variant="success" weight="semibold">Query executed successfully</Text>
<Text variant="error" weight="semibold">Error in query syntax</Text>
```

### Homepage
```tsx
// Welcome section
<Heading level={1} variant="gold" spacing="lg">Welcome to Trove</Heading>
<Text variant="muted" size="lg">Find your data gold</Text>

// Feature cards
<Heading level={3} variant="brown" spacing="sm">Data Explorer</Heading>
<Text variant="subtle">Browse and analyze your data with ease</Text>
``` 