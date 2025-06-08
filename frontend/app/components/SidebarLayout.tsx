"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Text, IconButton } from "./ui";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Menu icons
  const MenuIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Toggle button - fixed position with transition */}
      <IconButton
        icon={sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        variant="ghost"
        size="lg"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        className={`fixed top-4 z-40 bg-background dark:bg-card border border-border shadow-md hover:bg-accent/10 dark:hover:bg-accent/5 transition-all duration-300 ${
          sidebarOpen ? "left-[192px]" : "left-4"
        }`}
      />

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
