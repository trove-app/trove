import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode } from '../types/theme';
import { theme as defaultTheme } from '../styles/theme';

type ThemeContextType = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // Check system preference on mount
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system theme changes
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Update CSS custom properties when theme changes
    const root = document.documentElement;
    const colors = defaultTheme.colors[mode];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update theme class on body
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme: defaultTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 