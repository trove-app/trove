import type { Config } from 'tailwindcss';
import { theme } from './app/styles/theme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        heading: theme.typography.fontFamilies.heading,
        body: theme.typography.fontFamilies.body,
        code: theme.typography.fontFamilies.code,
      },
      fontSize: theme.typography.fontSizes,
      fontWeight: theme.typography.fontWeights,
      lineHeight: theme.typography.lineHeights,
      spacing: theme.spacing,
      borderRadius: {
        none: theme.borderRadius.none,
        sm: theme.borderRadius.sm,
        md: theme.borderRadius.md,
        lg: theme.borderRadius.lg,
        full: theme.borderRadius.full,
      },
      boxShadow: {
        sm: theme.shadows.sm,
        md: theme.shadows.md,
        lg: theme.shadows.lg,
        xl: theme.shadows.xl,
      },
      transitionDuration: {
        fast: theme.animation.durations.fast,
        normal: theme.animation.durations.normal,
        slow: theme.animation.durations.slow,
      },
      transitionTimingFunction: {
        'ease-in-out': theme.animation.easings.easeInOut,
        'ease-out': theme.animation.easings.easeOut,
        'ease-in': theme.animation.easings.easeIn,
      },
    },
  },
  plugins: [],
}

export default config; 