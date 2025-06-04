import React from 'react';
import { Text } from '../components/ui';

export default function DesignPage() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Debug Section - Basic HTML */}
        <section className="bg-red-100 p-4 border-2 border-red-500">
          <h1 className="text-3xl font-bold text-black mb-4">DEBUG: Basic HTML (should be visible)</h1>
          <p className="text-black">If you can see this, basic styling works but Text component might have issues.</p>
        </section>

        {/* Test Text Component */}
        <section className="bg-blue-100 p-4 border-2 border-blue-500">
          <h2 className="text-2xl font-bold text-black mb-4">DEBUG: Text Component Test</h2>
          <Text className="bg-white p-2 border-2 border-red-500">
            Can you see this Text component? (with white bg and red border)
          </Text>
          <br />
          <Text size="lg" variant="warning" className="bg-yellow-200 p-2 mt-2 border-2 border-orange-500">
            Large warning text on yellow background
          </Text>
        </section>
        
        {/* Original Page Header */}
        <header className="text-center bg-green-100 p-4">
          <Text as="h1" size="xl" weight="bold" className="text-4xl mb-2">
            ✨ Trove Design System
          </Text>
          <Text variant="secondary" size="lg" className="italic">
            "Find your data gold."
          </Text>
        </header>

        {/* Simplified Size Variants */}
        <section className="bg-card p-6 rounded-lg">
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            Text Size Variants
          </Text>
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
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            Color Variants
          </Text>
          <div className="space-y-3">
            <Text variant="default">Default - Theme foreground color</Text>
            <Text variant="primary">Primary - Theme foreground color</Text>
            <Text variant="secondary">Secondary - Chest Brown</Text>
            <Text variant="warning">Warning - Treasure Gold</Text>
            <Text variant="success">Success - Success green</Text>
            <Text variant="error">Error - Error red</Text>
            <Text variant="info">Info - Info blue</Text>
            <Text muted>Muted - Subtle theme text</Text>
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

        {/* Real-world Examples */}
        <section>
          <Text as="h2" size="xl" weight="semibold" className="mb-6 text-2xl">
            Real-world Usage Examples
          </Text>
          
          {/* Data Card Example */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#A25D2D]/10 mb-6">
            <Text size="lg" weight="semibold" className="mb-2">
              📊 Sales Data Nugget
            </Text>
            <Text variant="secondary" size="sm" className="mb-4">
              Last updated 2 hours ago
            </Text>
            <Text className="mb-3">
              Your sales team has uncovered some golden insights from this quarter's performance data.
            </Text>
            <Text size="sm" muted>
              Click to explore the full dataset and discover more valuable nuggets.
            </Text>
          </div>

          {/* Status Messages */}
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Text variant="success" weight="medium">✅ Data sync completed successfully</Text>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Text variant="warning" weight="medium">⚠️ Large dataset detected - processing may take longer</Text>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <Text variant="error" weight="medium">❌ Connection failed - please check your database credentials</Text>
            </div>
          </div>
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