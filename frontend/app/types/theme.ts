export type ColorTheme = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
};

export type ThemeColors = {
  light: ColorTheme;
  dark: ColorTheme;
};

export type Typography = {
  fontFamilies: {
    heading: string;
    body: string;
    code: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
};

export type Spacing = {
  px: string;
  0: string;
  0.5: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
};

export type BorderRadius = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
};

export type Shadows = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type Animation = {
  durations: {
    fast: string;
    normal: string;
    slow: string;
  };
  easings: {
    easeInOut: string;
    easeOut: string;
    easeIn: string;
  };
};

export type Theme = {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: Animation;
};

export type ThemeMode = 'light' | 'dark'; 