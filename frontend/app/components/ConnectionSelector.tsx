'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDatabaseConnection } from '../context/DatabaseConnectionContext';

interface ConnectionSelectorProps {
  className?: string;
}

export default function ConnectionSelector({ className = '' }: ConnectionSelectorProps) {
  const { connections, selectedConnection, selectConnection, loading } = useDatabaseConnection();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-sm text-muted-foreground">Loading connections...</div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>No database connections</span>
          <Link
            href="/connections"
            className="text-accent hover:text-accent/80 underline"
          >
            Add one
          </Link>
        </div>
      </div>
    );
  }

  if (connections.length === 1) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Database:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
            <span className="text-sm font-medium text-foreground">
              {selectedConnection?.name || connections[0].name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({selectedConnection?.connection_type || connections[0].connection_type})
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Database:</span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 
                     rounded-lg transition-colors text-sm font-medium text-foreground
                     focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <span>{selectedConnection?.name || 'Select connection'}</span>
            {selectedConnection && (
              <span className="text-xs text-muted-foreground">
                ({selectedConnection.connection_type})
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg 
                            shadow-treasure z-20 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {connections.map((connection) => (
                    <button
                      key={connection.id}
                      onClick={() => {
                        selectConnection(connection.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedConnection?.id === connection.id
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{connection.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {connection.username}@{connection.host}:{connection.port}/{connection.database}
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-muted rounded">
                          {connection.connection_type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <Link
                    href="/connections"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Manage Connections</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}