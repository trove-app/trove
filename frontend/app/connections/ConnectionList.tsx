'use client';

import React from 'react';
import { useDatabaseConnection, type DatabaseConnection } from '../context/DatabaseConnectionContext';

interface ConnectionListProps {
  onEdit: (connectionId: number) => void;
}

export default function ConnectionList({ onEdit }: ConnectionListProps) {
  const { 
    connections, 
    selectedConnection, 
    selectConnection, 
    deleteConnection 
  } = useDatabaseConnection();

  const handleDelete = async (connectionId: number) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        await deleteConnection(connectionId);
      } catch (error) {
        console.error('Failed to delete connection:', error);
      }
    }
  };

  const formatConnectionInfo = (connection: DatabaseConnection) => {
    return `${connection.username}@${connection.host}:${connection.port}/${connection.database}`;
  };

  return (
    <div className="space-y-3">
      {connections.map((connection) => (
        <div
          key={connection.id}
          className={`p-4 rounded-lg border transition-all ${
            selectedConnection?.id === connection.id
              ? 'border-accent bg-accent/5 shadow-soft'
              : 'border-border/50 hover:border-border'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground">{connection.name}</h3>
                <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                  {connection.connection_type}
                </span>
                {selectedConnection?.id === connection.id && (
                  <span className="px-2 py-1 text-xs rounded-md bg-accent text-accent-foreground">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {formatConnectionInfo(connection)}
              </p>
              <p className="text-xs text-muted-foreground">
                Created {new Date(connection.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedConnection?.id !== connection.id && (
                <button
                  onClick={() => selectConnection(connection.id)}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground 
                           rounded-md transition-colors"
                >
                  Select
                </button>
              )}
              <button
                onClick={() => onEdit(connection.id)}
                className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground 
                         rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(connection.id)}
                className="px-3 py-1.5 text-sm bg-destructive/10 hover:bg-destructive/20 
                         text-destructive rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}