import React from "react";
import type { ColumnMetadata } from "../context/SchemaContext";

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

const TableSidebar = ({ tables, selected, onSelect, filter, setFilter, columnMatches, onHover }: TableSidebarProps) => {
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
};

export type { TableSidebarProps };
export default TableSidebar; 