'use client';

import React, { useState, useEffect } from 'react';
import { Text, Heading, Card } from '../components/ui';

export default function DesignPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference and apply to document
  useEffect(() => {
    // Check if user has a saved preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialDarkMode);
    
    // Apply theme immediately
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="p-8 bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Theme Toggle - Enhanced */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Text size="sm" variant="muted">Theme Testing:</Text>
            <Text size="sm" variant={isDarkMode ? 'gold' : 'brown'}>
              {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
            </Text>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent/10 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="text-lg">{isDarkMode ? '🌙' : '☀️'}</span>
            <Text size="sm" weight="medium">
              Switch to {isDarkMode ? 'Light' : 'Dark'}
            </Text>
          </button>
        </div>

        {/* Quick Dark Mode Test Section */}
        <section className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <Heading level={3} variant="gold" spacing="sm">🧪 Dark Mode Test</Heading>
          <Text variant="muted" className="mb-4">
            These should change colors when you toggle the theme:
          </Text>
          
          {/* Background Test */}
          <div className="mb-6 p-4 rounded-lg" style={{backgroundColor: 'hsl(var(--color-background))', border: '2px solid hsl(var(--color-border))'}}>
            <Text weight="semibold" className="mb-2">Background Color Test:</Text>
            <Text size="sm" variant="muted">
              This box uses CSS variables directly. Background should be:
            </Text>
            <Text size="sm">
              Light: Cream (#FFF7EC) | Dark: Deep Navy (#1A1A1A)
            </Text>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Text variant="success">✅ Success text</Text>
              <Text variant="warning">⚠️ Warning text</Text>
              <Text variant="error">❌ Error text</Text>
              <Text variant="info">ℹ️ Info text</Text>
            </div>
            <div className="space-y-2">
              <Text variant="metric">📊 Metric text</Text>
              <Text variant="insight">💡 Insight text</Text>
              <Text variant="nugget">✨ Nugget text</Text>
              <Text variant="muted">Muted text</Text>
            </div>
          </div>
          
          {/* CSS Variables Debug */}
          <div className="mt-4 p-3 bg-muted/20 rounded text-xs font-mono">
            <Text size="xs" weight="medium" className="mb-2">CSS Variables (for debugging):</Text>
            <Text size="xs" className="block">--color-background: {isDarkMode ? '0 0% 10.2%' : '45 100% 96.5%'}</Text>
            <Text size="xs" className="block">--color-foreground: {isDarkMode ? '45 100% 96.5%' : '0 0% 16.5%'}</Text>
          </div>
        </section>

        {/* NEW: Heading Component Showcase */}
        <section className="bg-card p-6 rounded-lg">
          <Heading level={2} spacing="lg">🎯 Heading Component Showcase</Heading>
          
          {/* Heading Levels */}
          <div className="space-y-6">
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 1 (Responsive: 36px → 48px → 60px)</Text>
              <Heading level={1} spacing="sm">✨ Level 1 Heading</Heading>
            </div>
            
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 2 (Responsive: 30px → 36px → 48px)</Text>
              <Heading level={2} spacing="sm">📊 Level 2 Heading</Heading>
            </div>
            
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 3 (Responsive: 24px → 30px → 36px)</Text>
              <Heading level={3} spacing="sm">🔍 Level 3 Heading</Heading>
            </div>
            
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 4 (Responsive: 20px → 24px → 30px)</Text>
              <Heading level={4} spacing="sm">⚡ Level 4 Heading</Heading>
            </div>
            
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 5 (Responsive: 18px → 20px → 24px)</Text>
              <Heading level={5} spacing="sm">🪙 Level 5 Heading</Heading>
            </div>
            
            <div>
              <Text size="sm" variant="secondary" className="mb-2">Heading Level 6 (Responsive: 16px → 18px → 20px)</Text>
              <Heading level={6} spacing="sm">🧰 Level 6 Heading</Heading>
            </div>
          </div>
        </section>

        {/* Heading Variants */}
        <section className="bg-card p-6 rounded-lg">
          <Heading level={2} spacing="lg">🎨 Heading Color Variants</Heading>
          <div className="space-y-4">
            <Heading level={3} variant="default">Default Heading</Heading>
            <Heading level={3} variant="secondary">Secondary - Chest Brown</Heading>
            <Heading level={3} variant="gold">Gold - Treasure Gold Brand</Heading>
            <Heading level={3} variant="brown">Brown - Chest Brown Brand</Heading>
            <Heading level={3} variant="warning">Warning - Alert State</Heading>
            <Heading level={3} variant="success">Success - Data Loaded</Heading>
            <Heading level={3} variant="error">Error - Something Wrong</Heading>
            <Heading level={3} variant="info">Info - Data Information</Heading>
            <Heading level={3} variant="metric">Metric - Key Performance</Heading>
            <Heading level={3} variant="insight">Insight - Data Discovery</Heading>
            <Heading level={3} variant="nugget">✨ Nugget - Special Data!</Heading>
            <Heading level={3} muted>Muted Heading</Heading>
          </div>
        </section>

        {/* Heading Weights & Alignment */}
        <section className="bg-card p-6 rounded-lg">
          <Heading level={2} spacing="lg">⚖️ Heading Weights & Alignment</Heading>
          <div className="space-y-4">
            <Heading level={3} weight="medium">Medium Weight Heading</Heading>
            <Heading level={3} weight="semibold">Semibold Weight Heading</Heading>
            <Heading level={3} weight="bold">Bold Weight Heading (Default)</Heading>
            <Heading level={3} weight="extrabold">Extra Bold Weight Heading</Heading>
            
            <div className="border-t border-border pt-4 mt-6">
              <Heading level={3} align="left" spacing="sm">Left Aligned (Default)</Heading>
              <Heading level={3} align="center" spacing="sm">Center Aligned</Heading>
              <Heading level={3} align="right" spacing="sm">Right Aligned</Heading>
            </div>
          </div>
        </section>
        
        {/* Original Page Header - Now using Heading component */}
        <header className="text-center bg-green-100 p-4">
          <Heading level={1} spacing="sm">
            ✨ Trove Design System
          </Heading>
          <Text variant="secondary" size="lg" className="italic">
            "Find your data gold."
          </Text>
        </header>

        {/* Text Size Variants */}
        <section className="bg-card p-6 rounded-lg">
          <Heading level={2} spacing="lg">📏 Text Size Variants</Heading>
          <div className="space-y-4">
            <Text size="xs">Extra Small (xs) - 12px</Text>
            <Text size="sm">Small (sm) - 14px</Text>
            <Text size="md">Medium (md) - 16px (Default)</Text>
            <Text size="lg">Large (lg) - 18px</Text>
            <Text size="xl">Extra Large (xl) - 20px</Text>
          </div>
        </section>

        {/* Color Variants */}
        <section className="bg-card p-6 rounded-lg">
          <Heading level={2} spacing="lg">🌈 Text Color Variants</Heading>
          
          {/* Brand Colors */}
          <div className="mb-6">
            <Text weight="semibold" className="mb-3">Brand Colors</Text>
            <div className="space-y-2">
              <Text variant="default">Default - Theme foreground color</Text>
              <Text variant="primary">Primary - Theme foreground color</Text>
              <Text variant="gold">Gold - ✨ Treasure Gold highlight</Text>
              <Text variant="brown">Brown - 🪙 Chest Brown secondary</Text>
            </div>
          </div>

          {/* Status Colors */}
          <div className="mb-6">
            <Text weight="semibold" className="mb-3">Status Colors</Text>
            <div className="space-y-2">
              <Text variant="success">Success - ✅ Data loaded successfully</Text>
              <Text variant="warning">Warning - ⚠️ Data processing alert</Text>
              <Text variant="error">Error - ❌ Connection failed</Text>
              <Text variant="info">Info - ℹ️ Additional data information</Text>
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-6">
            <Text weight="semibold" className="mb-3">Semantic Colors</Text>
            <div className="space-y-2">
              <Text variant="muted">Muted - Secondary helper text</Text>
              <Text variant="subtle">Subtle - Even more understated</Text>
              <Text variant="accent">Accent - Theme accent color</Text>
              <Text variant="light">Light - 70% opacity text</Text>
              <Text variant="lighter">Lighter - 50% opacity text</Text>
            </div>
          </div>

          {/* Data-Specific Colors */}
          <div className="mb-6">
            <Text weight="semibold" className="mb-3">Data Exploration Colors</Text>
            <div className="space-y-2">
              <Text variant="metric">📊 Metric - Key performance indicators</Text>
              <Text variant="insight">💡 Insight - Data discoveries and findings</Text>
              <Text variant="nugget">✨ Nugget - Special valuable data!</Text>
            </div>
          </div>

          {/* Interactive Colors */}
          <div>
            <Text weight="semibold" className="mb-3">Interactive Colors</Text>
            <div className="space-y-2">
              <Text variant="interactive">Interactive - Hover to see color change</Text>
              <Text variant="link">Link - Underlines on hover with color</Text>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section>
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            Font Weight Variants
          </Text>
          <div className="space-y-3">
            <Text weight="normal">Normal weight - Regular text</Text>
            <Text weight="medium">Medium weight - Slightly emphasized</Text>
            <Text weight="semibold">Semibold weight - More emphasis</Text>
            <Text weight="bold">Bold weight - Strong emphasis</Text>
          </div>
        </section>

        {/* Text Alignment */}
        <section>
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            Text Alignment
          </Text>
          <div className="space-y-4 border border-[#A25D2D]/20 rounded-lg p-6">
            <Text align="left">Left aligned text (default)</Text>
            <Text align="center">Center aligned text</Text>
            <Text align="right">Right aligned text</Text>
          </div>
        </section>

        {/* HTML Element Variants */}
        <section>
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            HTML Element Variants
          </Text>
          <div className="space-y-3">
            <Text as="p">Paragraph element (default)</Text>
            <Text as="span" className="inline">Span element (inline) </Text>
            <Text as="span" className="inline">can be used together</Text>
            <Text as="div">Div element (block)</Text>
            <Text as="label">Label element (for forms)</Text>
          </div>
        </section>

        {/* Card Components Section */}
        <section className="space-y-6">
          <Heading level={2} variant="primary" spacing="lg">Card Components</Heading>
          <Text variant="muted">
            Foundational layout components for grouping content with consistent styling and behavior.
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Card */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Default Card</Text>
              <Card variant="default" padding="md">
                <Heading level={3} spacing="sm">Sales Data</Heading>
                <Text variant="muted">Monthly revenue: $24,500</Text>
                <Text size="sm" variant="success">↗ +12% from last month</Text>
              </Card>
            </div>

            {/* Glass Card */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Glass Card</Text>
              <Card variant="glass" padding="md">
                <Heading level={3} spacing="sm">Active Connections</Heading>
                <Text variant="muted">Database connections: 3/5</Text>
                <Text size="sm" variant="info">All systems operational</Text>
              </Card>
            </div>

            {/* Elevated Card */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Elevated Card</Text>
              <Card variant="elevated" padding="md">
                <Heading level={3} spacing="sm">Query Performance</Heading>
                <Text variant="muted">Avg execution: 2.3ms</Text>
                <Text size="sm" variant="success">Excellent performance</Text>
              </Card>
            </div>

            {/* Outlined Card */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Outlined Card</Text>
              <Card variant="outlined" padding="md">
                <Heading level={3} spacing="sm">Data Insights</Heading>
                <Text variant="muted">New nuggets available</Text>
                <Text size="sm" variant="warning">Requires attention</Text>
              </Card>
            </div>

            {/* Clickable Card */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Clickable Card</Text>
              <Card variant="glass" padding="md" clickable>
                <Heading level={3} spacing="sm">Interactive Dashboard</Heading>
                <Text variant="muted">Click to explore data</Text>
                <Text size="sm" variant="primary">Hover for preview →</Text>
              </Card>
            </div>

            {/* Different Sizes */}
            <div className="space-y-3">
              <Text size="lg" weight="semibold">Size Variants</Text>
              <div className="space-y-3">
                <Card variant="default" size="sm" padding="sm">
                  <Text size="sm">Small card</Text>
                </Card>
                <Card variant="default" size="md" padding="md">
                  <Text>Medium card (default)</Text>
                </Card>
                <Card variant="default" size="lg" padding="lg">
                  <Text>Large card with more content space</Text>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Card Usage Examples */}
        <section className="space-y-6">
          <Heading level={2} variant="accent" spacing="lg">Real-World Card Usage</Heading>
          
          {/* Data Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" padding="md" clickable>
              <div className="text-center space-y-2">
                <Text size="xl" weight="bold" variant="primary">24.5K</Text>
                <Text variant="muted">Total Records</Text>
                <Text size="sm" variant="success">📈 +8.2% this week</Text>
              </div>
            </Card>
            
            <Card variant="elevated" padding="md" clickable>
              <div className="text-center space-y-2">
                <Text size="xl" weight="bold" variant="accent">127ms</Text>
                <Text variant="muted">Avg Query Time</Text>
                <Text size="sm" variant="info">⚡ Optimized performance</Text>
              </div>
            </Card>
            
            <Card variant="default" padding="md" clickable>
              <div className="text-center space-y-2">
                <Text size="xl" weight="bold" variant="secondary">5/7</Text>
                <Text variant="muted">Data Sources</Text>
                <Text size="sm" variant="warning">🔗 2 pending connections</Text>
              </div>
            </Card>
          </div>

          {/* Content Cards */}
          <div className="space-y-4">
            <Card variant="glass" padding="lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading level={3}>Recent Query Results</Heading>
                  <Text size="sm" variant="muted">2 minutes ago</Text>
                </div>
                <Text variant="secondary">
                  Found 1,247 records matching your search criteria for "customer transactions" 
                  in the sales database. Data spans from Jan 2024 to present.
                </Text>
                <div className="flex space-x-2">
                  <Text size="sm" variant="success">✓ Query successful</Text>
                  <Text size="sm" variant="info">🔍 View results</Text>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Real-world Examples */}
        <section>
          <Heading level={2} spacing="lg">🏗️ Real-world Usage Examples</Heading>
          
          {/* Data Card Example with new variants */}
          <Card variant="default" padding="lg" className="mb-6">
            <Text variant="nugget" size="lg" className="mb-2">
              ✨ Sales Data Nugget
            </Text>
            <Text variant="muted" size="sm" className="mb-4">
              Last updated 2 hours ago
            </Text>
            <Text className="mb-3">
              Your sales team has uncovered some golden insights from this quarter's performance data.
            </Text>
            <div className="flex gap-4 text-sm">
              <Text variant="metric">📊 Revenue: $2.4M</Text>
              <Text variant="insight">💡 Growth: +15%</Text>
              <Text variant="success">✅ Target exceeded</Text>
            </div>
            <Text variant="link" size="sm" className="mt-3 inline-block">
              Click to explore the full dataset →
            </Text>
          </Card>

          {/* Trove Data Dashboard Example */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <Heading level={3} variant="gold" spacing="sm">🏆 Top Performing Tables</Heading>
            <Text variant="muted" className="mb-4">Discover your most valuable data sources</Text>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-950/20 rounded-lg">
                <Text weight="medium">users_analytics</Text>
                <Text variant="metric">🔥 847 queries</Text>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary-50 dark:bg-secondary-950/20 rounded-lg">
                <Text weight="medium">sales_transactions</Text>
                <Text variant="insight">💰 High value data</Text>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Text weight="medium">product_inventory</Text>
                <Text variant="muted">📦 Moderate usage</Text>
              </div>
            </div>
          </Card>

          {/* Status Messages with enhanced variants */}
          <div className="space-y-3">
            <Card variant="default" padding="md" className="bg-success-50 dark:bg-success-950/20 border-success-200 dark:border-success-800">
              <Text variant="success" weight="medium">✅ Database connection established</Text>
              <Text variant="subtle" size="sm" className="mt-1">All 247 tables are now accessible for exploration</Text>
            </Card>
            
            <Card variant="default" padding="md" className="bg-warning-50 dark:bg-warning-950/20 border-warning-200 dark:border-warning-800">
              <Text variant="warning" weight="medium">⚠️ Large dataset detected</Text>
              <Text variant="subtle" size="sm" className="mt-1">Processing 2.3M records - this may take a few moments</Text>
            </Card>
            
            <Card variant="default" padding="md" className="bg-error-50 dark:bg-error-950/20 border-error-200 dark:border-error-800">
              <Text variant="error" weight="medium">❌ Query execution failed</Text>
              <Text variant="subtle" size="sm" className="mt-1">Syntax error on line 23. <Text variant="link" as="span">View details →</Text></Text>
            </Card>

            <Card variant="default" padding="md" className="bg-info-50 dark:bg-info-950/20 border-info-200 dark:border-info-800">
              <Text variant="info" weight="medium">ℹ️ Query optimization suggestion</Text>
              <Text variant="subtle" size="sm" className="mt-1">Adding an index on 'created_at' could improve performance by 40%</Text>
            </Card>
          </div>

          {/* Interactive Data Exploration */}
          <Card variant="glass" padding="lg" className="mt-6">
            <Heading level={3} variant="brown" spacing="sm">🔍 Interactive Data Explorer</Heading>
            <Text variant="muted" className="mb-4">Hover over elements to see interactive states</Text>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg border border-border hover:border-primary-300 transition-colors cursor-pointer">
                <Text variant="interactive" weight="medium">📊 Charts</Text>
                <Text variant="light" size="sm">Visualize data</Text>
              </div>
              <div className="p-3 rounded-lg border border-border hover:border-primary-300 transition-colors cursor-pointer">
                <Text variant="interactive" weight="medium">📈 Metrics</Text>
                <Text variant="light" size="sm">Key insights</Text>
              </div>
              <div className="p-3 rounded-lg border border-border hover:border-primary-300 transition-colors cursor-pointer">
                <Text variant="interactive" weight="medium">🗃️ Tables</Text>
                <Text variant="light" size="sm">Raw data</Text>
              </div>
              <div className="p-3 rounded-lg border border-border hover:border-primary-300 transition-colors cursor-pointer">
                <Text variant="interactive" weight="medium">✨ Nuggets</Text>
                <Text variant="light" size="sm">Discoveries</Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-[#A25D2D]/20">
          <Text size="sm" muted>
            Built with ❤️ using Tailwind CSS v4 and the Trove Design System
          </Text>
        </footer>

      </div>
    </div>
  );
} 