'use client';
import React, { useState } from "react";
import { useSchema } from "../context/SchemaContext";

export default function SchemaExplorer() {
  const { tables, loading, error } = useSchema();
  const [openTables, setOpenTables] = useState<Record<string, boolean>>({});

  const toggleTable = (tableName: string) => {
    setOpenTables(prev => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  if (loading) return <div className="text-slate-500 dark:text-zinc-400">Loading schema...</div>;
  if (error) return <div className="text-red-600 font-semibold">{error}</div>;
  if (!tables.length) return <div className="text-slate-500 dark:text-zinc-400">No tables found.</div>;

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-slate-200 dark:border-zinc-800 mb-6">
      <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-zinc-100">Database Tables</h3>
      <ul className="space-y-2">
        {tables.map(table => (
          <li key={table.table_name}>
            <button
              className="w-full text-left font-semibold text-blue-700 dark:text-cyan-400 hover:underline focus:outline-none"
              onClick={() => toggleTable(table.table_name)}
            >
              {openTables[table.table_name] ? '▼' : '▶'} {table.table_name}
            </button>
            {openTables[table.table_name] && (
              <ul className="ml-6 mt-1 list-disc text-slate-700 dark:text-zinc-200">
                {table.columns.map(col => (
                  <li key={col.name} className="text-sm">
                    <span className="font-mono text-xs">{col.name}</span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-zinc-400">({col.data_type}{col.is_nullable ? ', nullable' : ''})</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 