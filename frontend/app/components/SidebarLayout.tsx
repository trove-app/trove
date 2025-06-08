"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { IconMenu2, IconX } from "@tabler/icons-react";

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
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-200 ease-in-out bg-transparent ${
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
        className="fixed top-4 left-4 z-40 
                   bg-card/80 backdrop-blur-sm
                   border border-border/50
                   rounded-xl p-2
                   shadow-sm hover:shadow-md
                   hover:bg-primary-100 dark:hover:bg-muted 
                   transform hover:scale-105
                   transition-all duration-200 ease-in-out
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? (
          <IconX className="w-5 h-8 text-foreground" stroke={2} />
        ) : (
          <IconMenu2 className="w-5 h-8 text-foreground" stroke={2} />
        )}
      </button>
      {/* Main content */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
