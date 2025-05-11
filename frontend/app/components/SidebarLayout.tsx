"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 bg-transparent ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-0">
          {" "}
          {/* No extra top padding */}
          <Sidebar />
        </div>
      </div>
      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full p-2 shadow-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        style={{ marginTop: 0 }}
      >
        {sidebarOpen ? (
          <span className="text-xl">×</span>
        ) : (
          <span className="text-xl">☰</span>
        )}
      </button>
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
