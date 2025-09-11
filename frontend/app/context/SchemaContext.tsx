'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useDatabaseConnection } from "./DatabaseConnectionContext";

export interface ColumnMetadata {
  name: string;
  data_type: string;
  is_nullable: boolean;
  default?: string | null;
}

export interface TableMetadata {
  table_name: string;
  columns: ColumnMetadata[];
}

export interface SchemaContextValue {
  tables: TableMetadata[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SchemaContext = createContext<SchemaContextValue | undefined>(undefined);

export function useSchema() {
  const ctx = useContext(SchemaContext);
  if (!ctx) throw new Error("useSchema must be used within a SchemaProvider");
  return ctx;
}

export function SchemaProvider({ children }: { children: ReactNode }) {
  const { selectedConnection } = useDatabaseConnection();
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async (connectionId?: number) => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/schema/tables";
      if (connectionId) {
        url += `?connection_id=${connectionId}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schema tables");
      const data = await res.json();
      setTables(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedConnection) {
      fetchTables(selectedConnection.id);
    } else {
      // Clear tables if no connection selected
      setTables([]);
    }
  }, [selectedConnection]);

  return (
    <SchemaContext.Provider value={{ 
      tables, 
      loading, 
      error, 
      refresh: () => fetchTables(selectedConnection?.id) 
    }}>
      {children}
    </SchemaContext.Provider>
  );
} 