'use client';

import React, { useState, useEffect } from 'react';
import { Text } from './ui';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme immediately and prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a saved preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialDarkMode);
    
    // Apply theme immediately to document
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply theme changes when isDarkMode state changes
  useEffect(() => {
    if (!mounted) return; // Don't run during initial mount
    
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

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-border bg-muted transition-all duration-200 shadow-sm">
        <span className="text-lg">⚪</span>
        <div className="flex flex-col items-start">
          <Text size="sm" weight="medium" as="span">
            Loading...
          </Text>
          <Text size="xs" variant="muted" as="span">
            Toggle theme
          </Text>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <span className="text-lg">{isDarkMode ? '🌙' : '☀️'}</span>
      <div className="flex flex-col items-start">
        <Text size="sm" weight="medium" as="span">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Text size="xs" variant="muted" as="span">
          Toggle theme
        </Text>
      </div>
    </button>
  );
} 