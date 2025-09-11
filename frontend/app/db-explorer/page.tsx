'use client';
import React, { useState, useEffect } from "react";
import { useSchema } from "../context/SchemaContext";
import ConnectionSelector from "../components/ConnectionSelector";
import TableSidebar from "./TableSidebar";
import TableDetails from "./TableDetails";


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
    <main className="flex flex-col min-h-screen bg-background px-4 py-8">
      {/* Connection Selector Header */}
      <div className="w-full max-w-5xl mx-auto mb-4">
        <ConnectionSelector />
      </div>
      
      {/* Main Content */}
      <div className="flex w-full max-w-5xl mx-auto h-[calc(100vh-12rem)] rounded-xl shadow-treasure 
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