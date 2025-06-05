'use client';
import React, { useState } from "react";
import { useSchema } from "../context/SchemaContext";
import type { ColumnMetadata } from "../context/SchemaContext";
import { Text, Heading, PageContainer } from "../components/ui";

interface Table {
  table_name: string;
  columns: ColumnMetadata[];
}

interface TableSidebarProps {
  tables: Table[];
  selected: string | null;
  onSelect: (tableName: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  columnMatches: Record<string, string[]>;
}

function TableSidebar({ tables, selected, onSelect, filter, setFilter, columnMatches }: TableSidebarProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const handleMouseEnter = (tableName: string) => (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      text: tableName,
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 4, // 4px below
    });
  };
  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <aside className="w-72 min-w-72 max-w-72 bg-white/90 dark:bg-zinc-900/90 border-r border-slate-200 dark:border-zinc-800 p-4 flex flex-col gap-2 h-full rounded-l-xl min-w-0">
      <input
        type="text"
        placeholder="Search tables and columns..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-3 px-3 py-2 rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ul className="flex-1 overflow-y-auto space-y-1">
        {tables.map((table) => (
          <li key={table.table_name} className="relative">
            <button
              className={`w-full text-left px-2 py-1 rounded font-mono text-base transition-colors flex flex-col items-start cursor-pointer ${selected === table.table_name ? "bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-cyan-400 font-bold" : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100"}`}
              onClick={() => onSelect(table.table_name)}
              onMouseEnter={handleMouseEnter(table.table_name)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              <span className="flex items-center w-full">
                <span className="mr-2">🗄️</span>
                <Text as="span" variant="primary" className="truncate max-w-[10rem] inline-block align-bottom">{highlight(table.table_name, filter)}</Text>
              </span>
              {filter && columnMatches[table.table_name]?.length > 0 && (
                <Text as="span" size="xs" variant="muted" className="ml-6 mt-0.5 text-slate-600 dark:text-slate-400">
                  ({columnMatches[table.table_name].length} col match{columnMatches[table.table_name].length > 1 ? 'es' : ''})
                </Text>
              )}
            </button>
          </li>
        ))}
      </ul>
      {/* Fixed-position tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-pre-line max-w-xs pointer-events-none"
          style={{
            left: Math.min(tooltip.x, window.innerWidth - 300),
            top: tooltip.y,
          }}
        >
          <Text size="xs" variant="light">{tooltip.text}</Text>
        </div>
      )}
    </aside>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

interface TableDetailsProps {
  table: Table | null;
  filter: string;
}

function TableDetails({ table, filter }: TableDetailsProps) {
  if (!table) return (
    <div className="flex-1 flex items-center justify-center">
      <Text variant="muted">Select a table to view details</Text>
    </div>
  );
  
  return (
    <section className="flex-1 p-8">
      <Heading 
        level={2} 
        variant="primary" 
        weight="bold" 
        spacing="md"
        className="flex items-center gap-2"
      >
        🗄️ <span className="break-words whitespace-pre-line">{highlight(table.table_name, filter)}</span>
      </Heading>
      <Text variant="muted" className="mb-2">Columns:</Text>
      <ul className="space-y-2">
        {table.columns.map((col) => {
          const isMatch = filter && col.name.toLowerCase().includes(filter.toLowerCase());
          return (
            <li key={col.name} className="flex items-center gap-2">
              <Text as="span" variant="primary" className={`font-mono ${isMatch ? 'font-semibold' : ''}`}>
                {highlight(col.name, filter)}
              </Text>
              <Text size="xs" variant="muted">({col.data_type}{col.is_nullable ? ", nullable" : ""})</Text>
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
    <PageContainer>
      <div className="flex w-full max-w-5xl h-[600px] rounded-xl shadow-xl bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <TableSidebar tables={filteredTables} selected={selected} onSelect={setSelected} filter={filter} setFilter={setFilter} columnMatches={columnMatches} />
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Text variant="muted">Loading schema...</Text>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <Text variant="error" weight="semibold">{error}</Text>
          </div>
        ) : (
          <TableDetails table={selectedTable} filter={filter} />
        )}
      </div>
    </PageContainer>
  );
} 