'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

interface SchemaContextValue {
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
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/schema/tables");
      if (!res.ok) throw new Error("Failed to fetch schema tables");
      const data = await res.json();
      setTables(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <SchemaContext.Provider value={{ tables, loading, error, refresh: fetchTables }}>
      {children}
    </SchemaContext.Provider>
  );
} 