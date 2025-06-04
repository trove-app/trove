import { Theme, ThemeMode } from '../types/theme';

/**
 * Get a color value from the theme
 */
export function getThemeColor(theme: Theme, mode: ThemeMode, color: keyof Theme['colors']['light']) {
  return theme.colors[mode][color];
}

/**
 * Get a spacing value from the theme
 */
export function getThemeSpacing(theme: Theme, size: keyof Theme['spacing']) {
  return theme.spacing[size];
}

/**
 * Get a font family from the theme
 */
export function getThemeFont(theme: Theme, type: keyof Theme['typography']['fontFamilies']) {
  return theme.typography.fontFamilies[type];
}

/**
 * Get a font size from the theme
 */
export function getThemeFontSize(theme: Theme, size: keyof Theme['typography']['fontSizes']) {
  return theme.typography.fontSizes[size];
}

/**
 * Get a border radius from the theme
 */
export function getThemeRadius(theme: Theme, size: keyof Theme['borderRadius']) {
  return theme.borderRadius[size];
}

/**
 * Get a shadow from the theme
 */
export function getThemeShadow(theme: Theme, size: keyof Theme['shadows']) {
  return theme.shadows[size];
}

/**
 * Get an animation duration from the theme
 */
export function getThemeAnimationDuration(theme: Theme, speed: keyof Theme['animation']['durations']) {
  return theme.animation.durations[speed];
}

/**
 * Get an animation easing from the theme
 */
export function getThemeAnimationEasing(theme: Theme, type: keyof Theme['animation']['easings']) {
  return theme.animation.easings[type];
}

/**
 * Generate CSS variable name for a theme property
 */
export function getCssVar(property: string) {
  return `var(--${property})`;
}

/**
 * Check if the current theme mode is dark
 */
export function isDarkMode(mode: ThemeMode): boolean {
  return mode === 'dark';
}

/**
 * Get the contrasting text color for a background color
 */
export function getContrastText(mode: ThemeMode) {
  return mode === 'dark' ? '#FFFFFF' : '#2A2A2A';
} 