'use client';
import React, { useState, useEffect } from "react";
import { useSchema } from "../context/SchemaContext";
import type { ColumnMetadata } from "../context/SchemaContext";
// TablePreview component is no longer used here, replaced by useTablePreviewData hook
import useTablePreviewData from '../hooks/useTablePreviewData';

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
  onHover?: (info: { type: 'table' | 'column'; name: string; dataType?: string } | null) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchIcon() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      className="text-muted-foreground"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TableSidebar({ tables, selected, onSelect, filter, setFilter, columnMatches, onHover }: TableSidebarProps) {
  return (
    <aside className="w-72 min-w-72 max-w-72 bg-card/80 backdrop-blur-sm border-r border-border/50 
                      p-4 flex flex-col gap-2 h-[calc(100%-2rem)] rounded-l-xl min-w-0">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search tables or columns..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-accent
                     transition-all duration-200"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {tables.map((table) => (
          <button
            key={table.table_name}
            onClick={() => onSelect(table.table_name)}
            onMouseEnter={() => onHover?.({ type: 'table', name: table.table_name })}
            onMouseLeave={() => onHover?.(null)}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200
                       flex items-center cursor-pointer
                       hover:bg-primary-100 dark:hover:bg-muted hover:shadow-soft
                       ${selected === table.table_name 
                         ? "bg-primary-100 dark:bg-muted text-accent font-semibold shadow-soft" 
                         : "text-foreground"}`}
          >
            <span className="mr-2 text-xl">🗄️</span>
            <span className="truncate max-w-[10rem] inline-block align-bottom">{table.table_name}</span>
            {filter && columnMatches[table.table_name]?.length > 0 && (
              <span className="ml-6 mt-1 text-xs text-accent">
                ({columnMatches[table.table_name].length} col match{columnMatches[table.table_name].length > 1 ? 'es' : ''})
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-accent/20 text-accent rounded-md px-1">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
}

interface TableDetailsProps {
  table: Table | null;
  filter: string;
  onHover?: (info: { type: 'table' | 'column'; name: string; dataType?: string } | null) => void;
}

function TableDetails({ table, filter, onHover }: TableDetailsProps) {
  const { data: previewData, loading: previewLoading, error: previewError } = useTablePreviewData(table?.table_name, 5); // Limit to 5 rows for this view

  if (!table) return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      ✨ Select a table to view details
    </div>
  );
  
  return (
    <section className="flex-1 p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 break-words text-foreground" title={table.table_name}>
        <span className="text-2xl">🗄️</span> 
        <span className="break-words whitespace-pre-line">{highlight(table.table_name, filter)}</span>
      </h2>

      <div className="mb-2 text-sm font-semibold text-muted-foreground">Column Details & Preview (first 5 values):</div>
      <ul className="space-y-1 border border-border/30 rounded-lg bg-card">
        {table.columns.map((col, index) => {
          const isMatch = filter && col.name.toLowerCase().includes(filter.toLowerCase());
          return (
            <li
              key={col.name}
              onMouseEnter={() => onHover?.({ type: 'column', name: col.name, dataType: col.data_type })}
              onMouseLeave={() => onHover?.(null)}
              className={`flex items-start transition-all duration-150 ${index > 0 ? 'border-t border-border/30' : ''}
                         ${isMatch ? 'bg-accent/5' : 'hover:bg-muted/30'}`}
            >
              {/* Left Column: Column Metadata */}
              <div className={`w-2/5 p-3 pr-2 ${isMatch ? 'text-accent font-medium' : 'text-foreground'}`}>
                <div className="font-mono text-sm mb-0.5 break-all">{highlight(col.name, filter)}</div>
                <div className="text-xs text-muted-foreground/80">
                  {col.data_type}{col.is_nullable ? ", nullable" : ""}
                </div>
              </div>

              {/* Right Column: Preview Data */}
              <div className="w-3/5 p-3 pl-2 border-l border-border/30 min-h-[4.5rem]"> {/* min-h to ensure some height for status messages */}
                {previewLoading && <div className="text-xs text-muted-foreground italic pt-1">Loading...</div>}
                {previewError && <div className="text-xs text-error-600 dark:text-error-500 italic pt-1 truncate" title={previewError}>Error</div>}

                {previewData && !previewLoading && !previewError && (
                  <div className="space-y-1">
                    {previewData.rows.length > 0 ? (
                      previewData.rows.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="text-xs text-foreground/90 truncate font-mono max-w-full" // max-w-full within its flex container
                          title={row[col.name] !== null && row[col.name] !== undefined ? String(row[col.name]) : 'NULL'}
                        >
                          {row[col.name] !== null && row[col.name] !== undefined ? String(row[col.name]) : <span className="italic text-muted-foreground/60">NULL</span>}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic pt-1">No preview values</div>
                    )}
                  </div>
                )}
                {/* Fallback for initial state before fetch or if data is null without error */}
                {!previewData && !previewLoading && !previewError && (
                     <div className="text-xs text-muted-foreground italic pt-1">Preview N/A</div>
                )}
              </div>
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
  const [hoveredInfo, setHoveredInfo] = useState<{ type: 'table' | 'column'; name: string; dataType?: string } | null>(null);
  
  const debouncedHoveredInfo = useDebounce(hoveredInfo, 50);

  const columnMatches: Record<string, string[]> = {};
  const filteredTables = tables.filter(t => {
    const tableMatch = t.table_name.toLowerCase().includes(filter.toLowerCase());
    const colMatches = t.columns.filter(col => col.name.toLowerCase().includes(filter.toLowerCase()));
    if (colMatches.length > 0) columnMatches[t.table_name] = colMatches.map(col => col.name);
    return tableMatch || colMatches.length > 0;
  });

  // Calculate total matching columns across all tables
  const totalMatchingColumns = Object.values(columnMatches).reduce((sum, cols) => sum + cols.length, 0);
  
  const getSearchSummary = () => {
    if (!filter) return 'Hover over a table or column to see details';
    
    const tableCount = filteredTables.length;
    const tableText = `${tableCount} ${tableCount === 1 ? 'table' : 'tables'}`;
    
    if (totalMatchingColumns === 0) {
      return `Found ${tableText} matching "${filter}"`;
    }

    const columnText = `${totalMatchingColumns} ${totalMatchingColumns === 1 ? 'column' : 'columns'}`;
    
    if (tableCount === 0) {
      return `Found ${columnText} matching "${filter}"`;
    }

    return `Found ${tableText} and ${columnText} matching "${filter}"`;
  };

  const selectedTable = tables.find(t => t.table_name === selected) || (filteredTables.length === 1 ? filteredTables[0] : null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-5xl h-[calc(100vh-8rem)] rounded-xl shadow-treasure 
                      bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
        <TableSidebar
          tables={filteredTables} 
          selected={selected} 
          onSelect={setSelected} 
          filter={filter}
          setFilter={setFilter}
          columnMatches={columnMatches}
          onHover={setHoveredInfo}
        />
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            ⚡ Loading schema...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-error-500 font-medium">
            {error}
          </div>
        ) : (
          // selectedTable is now passed directly to TableDetails, which handles the null case.
          // The wrapper div for TableDetails and TablePreview is removed.
          <TableDetails
            table={selectedTable}
            filter={filter}
            onHover={setHoveredInfo}
          />
        )}
        
        <div className="fixed bottom-0 left-0 right-0 h-8 min-h-8 px-3 py-1.5 bg-muted/30 backdrop-blur-sm border-t border-border/50 text-sm text-muted-foreground font-mono truncate transition-opacity duration-150">
          {debouncedHoveredInfo ? (
            debouncedHoveredInfo.type === 'table' 
              ? debouncedHoveredInfo.name
              : `${debouncedHoveredInfo.name} (${debouncedHoveredInfo.dataType})`
          ) : (
            getSearchSummary()
          )}
        </div>
      </div>
    </main>
  );
} 