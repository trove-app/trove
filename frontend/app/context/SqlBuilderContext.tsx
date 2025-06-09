import React, { createContext, useContext, useState, useCallback } from "react";
import { generateSql, parseSql } from "../utils/sqlUtils";

export type Join = {
  type: string;
  table: string;
  baseColumn: string;
  column: string;
};

export type QueryState = {
  table: string;
  columns: { table: string; column: string }[];
  joins: Join[];
  limit: number;
  filters: { table: string; column: string; op: string; value: string }[];
  orderBy: { table: string; column: string; direction: 'ASC' | 'DESC' }[];
};

interface SqlBuilderContextValue {
  queryState: QueryState;
  setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  sql: string;
  setSql: React.Dispatch<React.SetStateAction<string>>;
  updateFromVisual: (state: QueryState) => void;
  updateFromSql: (sql: string) => void;
}

const SqlBuilderContext = createContext<SqlBuilderContextValue | undefined>(undefined);

export function SqlBuilderProvider({ children }: { children: React.ReactNode }) {
  const [queryState, setQueryState] = useState<QueryState>({
    table: "",
    columns: [],
    joins: [],
    limit: 100,
    filters: [],
    orderBy: [],
  });
  const [sql, setSql] = useState<string>("");

  // Update state from visual builder
  const updateFromVisual = useCallback((state: QueryState) => {
    setQueryState(state);
    setSql(generateSql(state));
  }, []);

  // Update state from SQL editor
  const updateFromSql = useCallback((sql: string) => {
    setSql(sql);
    setQueryState(parseSql(sql));
  }, []);

  return (
    <SqlBuilderContext.Provider value={{
      queryState,
      setQueryState,
      sql,
      setSql,
      updateFromVisual,
      updateFromSql,
    }}>
      {children}
    </SqlBuilderContext.Provider>
  );
}

export function useSqlBuilder() {
  const ctx = useContext(SqlBuilderContext);
  if (!ctx) throw new Error("useSqlBuilder must be used within a SqlBuilderProvider");
  return ctx;
} 