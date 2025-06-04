import { Theme } from '../types/theme';

export const theme: Theme = {
  colors: {
    light: {
      background: '#FFF7EC', // Cream / Vanilla
      foreground: '#2A2A2A', // Charcoal Black
      primary: '#F4B100', // Treasure Gold
      secondary: '#A25D2D', // Chest Brown
      accent: '#F4B100', // Treasure Gold for accents
      muted: '#6B7280', // Subtle text and borders
    },
    dark: {
      background: '#1A1A1A', // Deep Navy/Black
      foreground: '#FFFFFF',
      primary: '#F4B100', // Keep Treasure Gold
      secondary: '#A25D2D', // Keep Chest Brown
      accent: '#F4B100',
      muted: '#9CA3AF',
    },
  },
  typography: {
    fontFamilies: {
      heading: 'Poppins, Inter, system-ui, sans-serif',
      body: 'Nunito, Lato, system-ui, sans-serif',
      code: 'Fira Code, JetBrains Mono, monospace',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  animation: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easings: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
}; 