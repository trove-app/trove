# Trove Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

## 🎨 Design System

Trove uses **Tailwind CSS v4** with a custom theme that reflects our brand identity - warm, clear, and delightful. Our design system emphasizes:

- **Treasure Gold** (`#F4B100`) and **Chest Brown** (`#A25D2D`) accents
- **Cream backgrounds** (`#FFF7EC`) with **charcoal text** (`#2A2A2A`)
- Rounded corners, soft shadows, and smooth animations
- Automatic dark mode support

### 📖 Documentation

- **[Theme Customization Guide](../docs/theme-customization.md)** - Complete guide to customizing colors, typography, spacing, and more
- **[Style Guide](../assets/style-guide.md)** - Brand identity and visual guidelines

### 🚀 Quick Start with Components

```tsx
// Use theme-aware colors
<div className="bg-background text-foreground">
  Content that adapts to light/dark mode
</div>

// Primary actions with treasure gold
<Button variant="primary">Click me</Button>

// Cards with soft shadows
<div className="bg-card border border-border rounded-lg p-6 shadow-soft">
  Card content
</div>
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
