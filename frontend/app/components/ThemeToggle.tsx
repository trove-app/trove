'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialDarkMode);
    
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-border bg-muted/50 transition-all duration-normal">
        <span className="text-lg">⚪</span>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Loading...</span>
          <span className="text-xs text-muted-foreground">Toggle theme</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg 
                 hover:bg-primary-100 dark:hover:bg-muted
                 transition-all duration-normal
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-lg">{isDarkMode ? '🌙' : '☀️'}</span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
        <span className="text-xs text-muted-foreground">
          Click to toggle theme
        </span>
      </div>
    </button>
  );
} 