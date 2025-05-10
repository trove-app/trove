'use client';
import React, { useState } from "react";
import { useSchema } from "../context/SchemaContext";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function TableSidebar({ tables, selected, onSelect, filter, setFilter, columnMatches }: any) {
  return (
    <aside className="w-72 bg-white/90 dark:bg-zinc-900/90 border-r border-slate-200 dark:border-zinc-800 p-4 flex flex-col gap-2 h-full rounded-l-xl">
      <input
        type="text"
        placeholder="Search tables or columns..."
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
              {filter && columnMatches[table.table_name]?.length > 0 && (
                <span className="ml-2 text-xs text-fuchsia-600 dark:text-fuchsia-400">({columnMatches[table.table_name].length} col match{columnMatches[table.table_name].length > 1 ? 'es' : ''})</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white rounded px-1">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
}

function TableDetails({ table, filter }: any) {
  if (!table) return <div className="flex-1 flex items-center justify-center text-slate-400">Select a table to view details</div>;
  return (
    <section className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🗄️ {highlight(table.table_name, filter)}
      </h2>
      <div className="mb-2 text-slate-600 dark:text-zinc-300">Columns:</div>
      <ul className="space-y-2">
        {table.columns.map((col: any) => {
          const isMatch = filter && col.name.toLowerCase().includes(filter.toLowerCase());
          return (
            <li key={col.name} className={`flex items-center gap-2 ${isMatch ? 'font-bold text-fuchsia-700 dark:text-fuchsia-400' : ''}`}>
              <span className="font-mono text-base">{highlight(col.name, filter)}</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">({col.data_type}{col.is_nullable ? ", nullable" : ""})</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function DBExplorerPage() {
  const { tables, loading, error } = useSchema();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  // Find tables that match the filter in name or columns
  const columnMatches: Record<string, string[]> = {};
  const filteredTables = tables.filter(t => {
    const tableMatch = t.table_name.toLowerCase().includes(filter.toLowerCase());
    const colMatches = t.columns.filter(col => col.name.toLowerCase().includes(filter.toLowerCase()));
    if (colMatches.length > 0) columnMatches[t.table_name] = colMatches.map(col => col.name);
    return tableMatch || colMatches.length > 0;
  });
  const selectedTable = tables.find(t => t.table_name === selected) || (filteredTables.length === 1 ? filteredTables[0] : null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <div className="flex w-full max-w-5xl h-[600px] rounded-xl shadow-xl bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <TableSidebar tables={filteredTables} selected={selected} onSelect={setSelected} filter={filter} setFilter={setFilter} columnMatches={columnMatches} />
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">Loading schema...</div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-600 font-semibold">{error}</div>
        ) : (
          <TableDetails table={selectedTable} filter={filter} />
        )}
      </div>
    </main>
  );
} 