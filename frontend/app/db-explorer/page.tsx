'use client';
import React, { useState } from "react";
import { useSchema } from "../context/SchemaContext";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function TableSidebar({ tables, selected, onSelect, filter, setFilter }: any) {
  return (
    <aside className="w-72 bg-white/90 dark:bg-zinc-900/90 border-r border-slate-200 dark:border-zinc-800 p-4 flex flex-col gap-2 h-full rounded-l-xl">
      <input
        type="text"
        placeholder="Search tables..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-3 px-3 py-2 rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100"
      />
      <ul className="flex-1 overflow-y-auto space-y-1">
        {tables.map((table: any) => (
          <li key={table.table_name}>
            <button
              className={`w-full text-left px-2 py-1 rounded font-mono text-base transition-colors ${selected === table.table_name ? "bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-cyan-400 font-bold" : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100"}`}
              onClick={() => onSelect(table.table_name)}
            >
              <span className="mr-2">🗄️</span>{table.table_name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function TableDetails({ table }: any) {
  if (!table) return <div className="flex-1 flex items-center justify-center text-slate-400">Select a table to view details</div>;
  return (
    <section className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🗄️ {table.table_name}
      </h2>
      <div className="mb-2 text-slate-600 dark:text-zinc-300">Columns:</div>
      <ul className="space-y-2">
        {table.columns.map((col: any) => (
          <li key={col.name} className="flex items-center gap-2">
            <span className="font-mono text-base text-blue-700 dark:text-cyan-400">{col.name}</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">({col.data_type}{col.is_nullable ? ", nullable" : ""})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DBExplorerPage() {
  const { tables, loading, error } = useSchema();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const filteredTables = tables.filter(t => t.table_name.toLowerCase().includes(filter.toLowerCase()));
  const selectedTable = tables.find(t => t.table_name === selected);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <div className="flex w-full max-w-5xl h-[600px] rounded-xl shadow-xl bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <TableSidebar tables={filteredTables} selected={selected} onSelect={setSelected} filter={filter} setFilter={setFilter} />
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">Loading schema...</div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-600 font-semibold">{error}</div>
        ) : (
          <TableDetails table={selectedTable} />
        )}
      </div>
    </main>
  );
} 