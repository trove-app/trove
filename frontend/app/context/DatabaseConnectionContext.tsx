'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface DatabaseConnection {
  id: number;
  name: string;
  connection_type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  ssl_mode: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface DatabaseConnectionCreate {
  name: string;
  connection_type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl_mode?: string;
}

export interface DatabaseConnectionUpdate {
  name?: string;
  connection_type?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl_mode?: string;
}

export interface DatabaseConnectionContextValue {
  connections: DatabaseConnection[];
  selectedConnection: DatabaseConnection | null;
  loading: boolean;
  error: string | null;
  selectConnection: (connectionId: number) => void;
  addConnection: (connection: DatabaseConnectionCreate) => Promise<void>;
  updateConnection: (id: number, updates: DatabaseConnectionUpdate) => Promise<void>;
  deleteConnection: (id: number) => Promise<void>;
  refresh: () => void;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextValue | undefined>(undefined);

export function useDatabaseConnection() {
  const ctx = useContext(DatabaseConnectionContext);
  if (!ctx) {
    throw new Error("useDatabaseConnection must be used within a DatabaseConnectionProvider");
  }
  return ctx;
}

const SELECTED_CONNECTION_KEY = 'trove-selected-connection-id';

export function DatabaseConnectionProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<DatabaseConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/connections");
      if (!res.ok) throw new Error("Failed to fetch database connections");
      const data = await res.json();
      setConnections(data);
      
      // Auto-select connection based on localStorage or first available
      const savedConnectionId = localStorage.getItem(SELECTED_CONNECTION_KEY);
      if (savedConnectionId && data.length > 0) {
        const savedConnection = data.find((conn: DatabaseConnection) => conn.id === parseInt(savedConnectionId));
        if (savedConnection) {
          setSelectedConnection(savedConnection);
        } else if (data.length > 0) {
          // Fallback to first connection if saved one doesn't exist
          setSelectedConnection(data[0]);
          localStorage.setItem(SELECTED_CONNECTION_KEY, data[0].id.toString());
        }
      } else if (data.length > 0) {
        // Auto-select first connection if none saved
        setSelectedConnection(data[0]);
        localStorage.setItem(SELECTED_CONNECTION_KEY, data[0].id.toString());
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const selectConnection = (connectionId: number) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection) {
      setSelectedConnection(connection);
      localStorage.setItem(SELECTED_CONNECTION_KEY, connectionId.toString());
    }
  };

  const addConnection = async (connection: DatabaseConnectionCreate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connection),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create connection");
      }
      
      const newConnection = await res.json();
      setConnections(prev => [...prev, newConnection]);
      
      // Auto-select new connection if it's the first one
      if (connections.length === 0) {
        setSelectedConnection(newConnection);
        localStorage.setItem(SELECTED_CONNECTION_KEY, newConnection.id.toString());
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err; // Re-throw so calling component can handle it
    } finally {
      setLoading(false);
    }
  };

  const updateConnection = async (id: number, updates: DatabaseConnectionUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update connection");
      }
      
      const updatedConnection = await res.json();
      setConnections(prev => prev.map(conn => 
        conn.id === id ? updatedConnection : conn
      ));
      
      // Update selected connection if it was the one being updated
      if (selectedConnection?.id === id) {
        setSelectedConnection(updatedConnection);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteConnection = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete connection");
      }
      
      setConnections(prev => prev.filter(conn => conn.id !== id));
      
      // Clear selected connection if it was deleted
      if (selectedConnection?.id === id) {
        const remainingConnections = connections.filter(conn => conn.id !== id);
        if (remainingConnections.length > 0) {
          setSelectedConnection(remainingConnections[0]);
          localStorage.setItem(SELECTED_CONNECTION_KEY, remainingConnections[0].id.toString());
        } else {
          setSelectedConnection(null);
          localStorage.removeItem(SELECTED_CONNECTION_KEY);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const value: DatabaseConnectionContextValue = {
    connections,
    selectedConnection,
    loading,
    error,
    selectConnection,
    addConnection,
    updateConnection,
    deleteConnection,
    refresh: fetchConnections,
  };

  return (
    <DatabaseConnectionContext.Provider value={value}>
      {children}
    </DatabaseConnectionContext.Provider>
  );
}