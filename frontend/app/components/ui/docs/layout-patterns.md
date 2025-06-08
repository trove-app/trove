# 📐 Layout Composition Patterns

*A guide to composing layouts in Trove's design system*

## Table of Contents
- [Core Components](#core-components)
- [Layout Patterns](#layout-patterns)
- [Common Compositions](#common-compositions)
- [Best Practices](#best-practices)
- [Examples from Trove](#examples-from-trove)

## Core Components

### Container
The `Container` component provides consistent max-width constraints and horizontal padding.

```tsx
import { Container } from '../components/ui';

// Basic usage
<Container>
  <YourContent />
</Container>

// With max-width variants
<Container maxWidth="sm">Narrow content</Container>
<Container maxWidth="md">Medium content</Container>
<Container maxWidth="lg">Wide content</Container>
<Container maxWidth="xl">Extra wide content</Container>
<Container maxWidth="2xl">Maximum width content</Container>
<Container maxWidth="full">Full width content</Container>
```

### Card
The `Card` component provides a flexible container with consistent styling.

```tsx
import { Card } from '../components/ui';

// Basic usage
<Card>
  <YourContent />
</Card>

// With variants
<Card variant="default">Default card</Card>
<Card variant="glass">Glass effect card</Card>
<Card variant="outlined">Outlined card</Card>
<Card variant="elevated">Elevated card</Card>

// With padding sizes
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>
```

## Layout Patterns

### Flex Layouts
We provide several flex-based layout patterns through the `layoutPatterns` utility:

```tsx
import { cn, layoutPatterns } from '../utils';

// Center content horizontally and vertically
<div className={layoutPatterns.flexCenter}>
  <YourContent />
</div>

// Space items between
<div className={layoutPatterns.flexBetween}>
  <LeftContent />
  <RightContent />
</div>

// Vertical stack
<div className={layoutPatterns.flexCol}>
  <FirstItem />
  <SecondItem />
</div>

// Horizontal row
<div className={layoutPatterns.flexRow}>
  <LeftItem />
  <RightItem />
</div>
```

### Spacing
Consistent spacing patterns for vertical and horizontal layouts:

```tsx
// Vertical spacing
<div className={layoutPatterns.spacing.sm}>Small gaps</div>
<div className={layoutPatterns.spacing.md}>Medium gaps</div>
<div className={layoutPatterns.spacing.lg}>Large gaps</div>

// Horizontal spacing
<div className={layoutPatterns.hSpacing.sm}>Small horizontal gaps</div>
<div className={layoutPatterns.hSpacing.md}>Medium horizontal gaps</div>
<div className={layoutPatterns.hSpacing.lg}>Large horizontal gaps</div>
```

### Grid Layouts
Pre-configured responsive grid layouts:

```tsx
// Two columns on larger screens
<div className={layoutPatterns.grid2Cols}>
  <GridItem />
  <GridItem />
</div>

// Three columns on larger screens
<div className={layoutPatterns.grid3Cols}>
  <GridItem />
  <GridItem />
  <GridItem />
</div>

// Four columns on larger screens
<div className={layoutPatterns.grid4Cols}>
  <GridItem />
  <GridItem />
  <GridItem />
  <GridItem />
</div>
```

## Common Compositions

### Page Layout
```tsx
function PageLayout() {
  return (
    <Container maxWidth="xl">
      <div className={cn(layoutPatterns.spacing.xl)}>
        <header className={layoutPatterns.flexBetween}>
          <Logo />
          <Navigation />
        </header>
        
        <main className={layoutPatterns.spacing.lg}>
          <PageTitle />
          <Content />
        </main>
        
        <footer className={layoutPatterns.flexCenter}>
          <FooterContent />
        </footer>
      </div>
    </Container>
  );
}
```

### Split Layout
```tsx
function SplitLayout() {
  return (
    <Card className={layoutPatterns.flexRow}>
      <aside className="w-72 border-r border-border">
        <SidebarContent />
      </aside>
      <main className="flex-1">
        <MainContent />
      </main>
    </Card>
  );
}
```

### Card Grid
```tsx
function CardGrid() {
  return (
    <Container>
      <div className={layoutPatterns.grid3Cols}>
        {items.map(item => (
          <Card key={item.id}>
            <Card.Header>{item.title}</Card.Header>
            <Card.Content>{item.content}</Card.Content>
          </Card>
        ))}
      </div>
    </Container>
  );
}
```

## Best Practices

1. **Consistent Spacing**
   - Use `layoutPatterns.spacing` for vertical gaps
   - Use `layoutPatterns.hSpacing` for horizontal gaps
   - Maintain consistent rhythm with predefined spacing scales

2. **Responsive Design**
   - Start with mobile layout
   - Use our grid patterns for responsive columns
   - Adjust spacing at breakpoints using responsive modifiers

3. **Component Composition**
   - Prefer composition over configuration
   - Use `Card` for contained content sections
   - Use `Container` for page-level width constraints

4. **Layout Structure**
   - Use semantic HTML elements
   - Maintain proper heading hierarchy
   - Consider accessibility in layout structure

## Examples from Trove

### DB Explorer Layout
```tsx
function DBExplorer() {
  return (
    <Container maxWidth="7xl" className="py-8">
      <Card variant="glass" className={cn(
        layoutPatterns.flexRow,
        "w-full max-w-5xl h-[600px] rounded-xl shadow-xl overflow-hidden"
      )}>
        <TableSidebar />
        <TableDetails />
      </Card>
    </Container>
  );
}
```

### SQL Builder Layout
```tsx
function SQLBuilder() {
  return (
    <Container maxWidth="xl">
      <div className={cn(layoutPatterns.spacing.lg, "py-8")}>
        <QueryEditor />
        <ResultsTable />
      </div>
    </Container>
  );
}
```

### Homepage Layout
```tsx
function Homepage() {
  return (
    <Container>
      <div className={layoutPatterns.spacing.xl}>
        <HeroSection />
        <div className={layoutPatterns.grid3Cols}>
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </div>
      </div>
    </Container>
  );
}
```

Remember:
- Keep layouts simple and predictable
- Use our layout patterns consistently
- Compose components for flexibility
- Consider responsive behavior from the start
- Follow the spacing scale for rhythm

*"Good layout is like a treasure map - it guides users naturally to what they seek."* ✨ 