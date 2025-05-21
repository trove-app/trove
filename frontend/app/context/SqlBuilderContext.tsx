import React, { createContext, useContext, useState, useCallback } from "react";

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
};

interface SqlBuilderContextValue {
  queryState: QueryState;
  setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  sql: string;
  setSql: React.Dispatch<React.SetStateAction<string>>;
  updateFromVisual: (state: QueryState) => void;
  updateFromSql: (sql: string) => void;
  generateSql: (state: QueryState) => string;
  parseSql: (sql: string) => QueryState;
}

const SqlBuilderContext = createContext<SqlBuilderContextValue | undefined>(undefined);

export function SqlBuilderProvider({ children }: { children: React.ReactNode }) {
  const [queryState, setQueryState] = useState<QueryState>({
    table: "",
    columns: [],
    joins: [],
    limit: 100,
  });
  const [sql, setSql] = useState<string>("");

  // Generate SQL from state (basic, can be improved)
  const generateSql = useCallback((state: QueryState) => {
    if (!state.table) return "";
    // Assign aliases
    const joinedTables = [
      ...(state.table ? [{ table_name: state.table }] : []),
      ...state.joins.map(j => ({ table_name: j.table })),
    ];
    const tableAliases: Record<string, string> = {};
    joinedTables.forEach((t, i) => {
      tableAliases[t.table_name] = `t${i}`;
    });
    // SELECT clause
    const cols =
      state.columns.length > 0
        ? state.columns
            .map(
              c =>
                `${tableAliases[c.table]}.${c.column} AS ${c.table}_${c.column}`
            )
            .join(", ")
        : "*";
    // FROM and JOINs
    let sql = `SELECT ${cols} FROM ${state.table} ${tableAliases[state.table]} `;
    state.joins.forEach((j) => {
      sql += `LEFT JOIN ${j.table} ${tableAliases[j.table]} ON ${tableAliases[state.table]}.${j.baseColumn} = ${tableAliases[j.table]}.${j.column} `;
    });
    if (state.limit) sql += `LIMIT ${state.limit}`;
    return sql.trim();
  }, []);

  // Parse SQL into state (very basic, only supports simple SELECTs)
  const parseSql = useCallback((sql: string): QueryState => {
    // Only handles: SELECT col1, col2 FROM table LIMIT n
    const match = sql.match(/^\s*SELECT\s+([\w\s,\*]+)\s+FROM\s+(\w+)(?:\s+LIMIT\s+(\d+))?/i);
    if (!match) return { table: "", columns: [], joins: [], limit: 100 };
    const [, cols, table, lim] = match;
    const columns = cols.trim() === "*" ? [] : cols.split(",").map(s => ({ table, column: s.trim() }));
    return {
      table: table || "",
      columns,
      joins: [], // Not supported in this basic parser
      limit: lim ? Number(lim) : 100,
    };
  }, []);

  // Update state from visual builder
  const updateFromVisual = useCallback((state: QueryState) => {
    setQueryState(state);
    setSql(generateSql(state));
  }, [generateSql]);

  // Update state from SQL editor
  const updateFromSql = useCallback((sql: string) => {
    setSql(sql);
    setQueryState(parseSql(sql));
  }, [parseSql]);

  return (
    <SqlBuilderContext.Provider value={{
      queryState,
      setQueryState,
      sql,
      setSql,
      updateFromVisual,
      updateFromSql,
      generateSql,
      parseSql,
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