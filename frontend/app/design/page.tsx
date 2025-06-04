import React from 'react';

export default function DesignPage() {
  return (
    <div className="p-8 bg-red-500 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Design System - TEST</h1>
      
      {/* Simple test with basic Tailwind colors */}
      <div className="bg-blue-500 p-4 mb-4 rounded">
        <p className="text-white">If you can see this blue box with white text, Tailwind is working!</p>
      </div>

      {/* Brand Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Brand Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-brand-gold text-black rounded-lg">Treasure Gold</div>
          <div className="p-4 bg-brand-brown text-white rounded-lg">Chest Brown</div>
          <div className="p-4 bg-brand-dark text-white rounded-lg">Deep Navy/Black</div>
        </div>
      </section>

      {/* Primary Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Primary Colors (Gold Scale)</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 bg-primary-50 text-black rounded-lg">50</div>
          <div className="p-4 bg-primary-100 text-black rounded-lg">100</div>
          <div className="p-4 bg-primary-200 text-black rounded-lg">200</div>
          <div className="p-4 bg-primary-300 text-black rounded-lg">300</div>
          <div className="p-4 bg-primary-400 text-black rounded-lg">400</div>
          <div className="p-4 bg-primary-500 text-black rounded-lg">500</div>
          <div className="p-4 bg-primary-600 text-white rounded-lg">600</div>
          <div className="p-4 bg-primary-700 text-white rounded-lg">700</div>
          <div className="p-4 bg-primary-800 text-white rounded-lg">800</div>
          <div className="p-4 bg-primary-900 text-white rounded-lg">900</div>
        </div>
      </section>

      {/* Secondary Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Secondary Colors (Brown Scale)</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 bg-secondary-50 text-black rounded-lg">50</div>
          <div className="p-4 bg-secondary-100 text-black rounded-lg">100</div>
          <div className="p-4 bg-secondary-200 text-black rounded-lg">200</div>
          <div className="p-4 bg-secondary-300 text-black rounded-lg">300</div>
          <div className="p-4 bg-secondary-400 text-black rounded-lg">400</div>
          <div className="p-4 bg-secondary-500 text-white rounded-lg">500</div>
          <div className="p-4 bg-secondary-600 text-white rounded-lg">600</div>
          <div className="p-4 bg-secondary-700 text-white rounded-lg">700</div>
          <div className="p-4 bg-secondary-800 text-white rounded-lg">800</div>
          <div className="p-4 bg-secondary-900 text-white rounded-lg">900</div>
        </div>
      </section>

      {/* Example Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Example Components</h2>
        <div className="space-y-4">
          {/* Buttons */}
          <div className="space-x-4">
            <button className="px-4 py-2 bg-primary-500 text-black rounded hover:bg-primary-600 hover:text-white">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600">
              Secondary Button
            </button>
          </div>

          {/* Card */}
          <div className="p-6 bg-background border border-primary-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Example Card</h3>
            <p className="text-foreground/80">
              This is an example card component using our color system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 