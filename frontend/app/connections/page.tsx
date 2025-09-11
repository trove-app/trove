'use client';

import React, { useState } from 'react';
import { useDatabaseConnection } from '../context/DatabaseConnectionContext';
import ConnectionForm from './ConnectionForm';
import ConnectionList from './ConnectionList';

export default function ConnectionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingConnection, setEditingConnection] = useState<number | null>(null);
  const { connections, loading, error } = useDatabaseConnection();

  const handleEditConnection = (connectionId: number) => {
    setEditingConnection(connectionId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConnection(null);
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Database Connections</h1>
          <p className="text-muted-foreground">
            Manage your database connections for exploring data and running queries.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Connection List */}
          <div className="flex-1">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-treasure">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Your Connections</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground 
                             rounded-lg font-medium transition-colors shadow-soft"
                  >
                    Add Connection
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading connections...</div>
                  </div>
                ) : connections.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔗</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No connections yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first database connection to start exploring data.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground 
                               rounded-lg font-medium transition-colors shadow-soft"
                    >
                      Add Your First Connection
                    </button>
                  </div>
                ) : (
                  <ConnectionList onEdit={handleEditConnection} />
                )}
              </div>
            </div>
          </div>

          {/* Connection Form */}
          {showForm && (
            <div className="w-96">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-treasure">
                <div className="p-6 border-b border-border/50">
                  <h2 className="text-xl font-semibold text-foreground">
                    {editingConnection ? 'Edit Connection' : 'Add New Connection'}
                  </h2>
                </div>
                <div className="p-6">
                  <ConnectionForm
                    connectionId={editingConnection}
                    onClose={handleCloseForm}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}