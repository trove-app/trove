# 🎨 Trove Design System & Theme Customization

## Overview

Trove uses **Tailwind CSS v4** with a custom theme configuration that perfectly aligns with our brand identity. Our design system emphasizes warmth, clarity, and delight through carefully chosen colors, typography, and spacing.

## 🌈 Theme Architecture

### Core Philosophy
- **Warm & Inviting**: Cream backgrounds with treasure gold accents
- **Clear & Readable**: High contrast with generous spacing
- **Delightful**: Rounded corners, soft shadows, smooth animations
- **Accessible**: WCAG compliant color contrasts and focus states

### Theme Configuration Location
All theme customization happens in `frontend/app/globals.css` using Tailwind v4's `@theme` directive:

```css
@import "tailwindcss";

@theme {
  /* All custom theme tokens go here */
}
```

## 🎯 Brand Colors

### Primary Brand Colors
```css
--color-brand-gold: #F4B100;     /* Treasure Gold - Primary accent */
--color-brand-brown: #A25D2D;    /* Chest Brown - Secondary accent */
--color-brand-dark: #1A1A1A;     /* Deep Navy/Black - Dark backgrounds */
--color-brand-cream: #FFF7EC;    /* Vanilla Cream - Light backgrounds */
--color-brand-charcoal: #2A2A2A; /* Charcoal - Primary text */
```

### Usage in Components
```tsx
// Primary buttons
<Button variant="primary">Primary Action</Button>

// Secondary buttons  
<Button variant="secondary">Secondary Action</Button>

// Background sections
<div className="bg-background text-foreground">
  Content with theme-aware colors
</div>

// Animated button
<Button className="transition-all duration-normal hover:scale-105">Animated Button</Button>
```

## 🎨 Color System

### Color Scale Structure
Each color has a complete scale from 50 (lightest) to 950 (darkest):

```css
--color-primary-50: #fefbf0;   /* Very light gold */
--color-primary-500: #F4B100;  /* Brand gold */
--color-primary-950: #472e05;  /* Very dark gold */
```

### Semantic Colors
- **Primary**: Treasure Gold scale for main actions and highlights
- **Secondary**: Chest Brown scale for secondary actions
- **Success**: Green scale for positive states
- **Warning**: Gold scale for caution states  
- **Error**: Red scale for error states
- **Info**: Blue scale for informational states

## 🔤 Typography System

### Font Families
```css
--font-sans: ui-sans-serif, system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas;
```

### Typography Scale
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
--font-size-6xl: 3.75rem;   /* 60px */
```

### Usage Examples
```tsx
<h1 className="text-4xl font-bold text-foreground">Main Heading</h1>
<p className="text-base text-muted-foreground">Body text</p>
<code className="font-mono text-sm">Code snippet</code>
```

## 📏 Spacing & Layout

### Spacing Scale
Based on `--spacing: 0.25rem` (4px) base unit:

```css
--spacing: 0.25rem;      /* 4px base unit */
--spacing-18: 4.5rem;    /* 72px */
--spacing-112: 28rem;    /* 448px */
--spacing-128: 32rem;    /* 512px */
--spacing-144: 36rem;    /* 576px */
```

### Border Radius
```css
--radius-sm: 0.5rem;     /* 8px - Small elements */
--radius: 0.75rem;       /* 12px - Default */
--radius-lg: 1rem;       /* 16px - Cards */
--radius-xl: 1.5rem;     /* 24px - Large cards */
--radius-2xl: 2rem;      /* 32px - Hero sections */
```

## 🌙 Dark Mode

### Automatic Theme Switching
Dark mode is handled automatically via `@media (prefers-color-scheme: dark)`:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 0 0% 10.2%; /* Deep navy */
    --color-foreground: 45 100% 96.5%; /* Cream text */
    /* ... other dark mode overrides */
  }
}
```

### Dark Mode Usage
```tsx
// Colors automatically adapt to dark mode
<div className="bg-background text-foreground border-border">
  This adapts to light/dark mode automatically
</div>

// Manual dark mode variants (if needed)
<div className="bg-white dark:bg-gray-900">
  Manual dark mode control
</div>
```

## ✨ Shadows & Effects

### Shadow System
```css
--shadow-soft: 0 2px 8px rgba(26, 26, 26, 0.08);      /* Subtle depth */
--shadow-glow: 0 0 12px rgba(244, 177, 0, 0.25);      /* Gold glow */
--shadow-treasure: 0 4px 16px rgba(244, 177, 0, 0.15); /* Treasure effect */
--shadow-depth: 0 8px 32px rgba(26, 26, 26, 0.12);    /* Deep shadow */
```

### Usage
```tsx
<div className="shadow-soft hover:shadow-treasure transition-shadow">
  Card with treasure glow on hover
</div>
```

## 🎬 Animations

### Duration Tokens
```css
--duration-fast: 150ms;    /* Quick interactions */
--duration-normal: 250ms;  /* Standard transitions */
--duration-slow: 350ms;    /* Deliberate animations */
```

### Usage
```tsx
<Button className="transition-all duration-normal hover:scale-105">
  Smooth hover effect
</Button>
```

## 🛠️ Customization Guidelines

### Adding New Colors
1. Add to the appropriate color scale in `