'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg 
                 hover:bg-primary-100 dark:hover:bg-muted
                 transition-all duration-normal
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
        <span className="text-xs text-muted-foreground">
          Click to toggle theme
        </span>
      </div>
    </button>
  );
} 