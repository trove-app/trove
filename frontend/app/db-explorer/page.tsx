'use client';
import React, { useState } from "react";
import { useSchema } from "../context/SchemaContext";
import type { ColumnMetadata } from "../context/SchemaContext";
import { Text, Heading, Container, SearchInput, Button, Card } from "../components/ui";
import { cn, layoutPatterns } from "../components/ui/utils";

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

  return (
    <Card 
      variant="glass" 
      className={cn(
        layoutPatterns.flexCol,
        "w-72 min-w-72 max-w-72 border-r border-border rounded-l-xl rounded-r-none p-4 gap-2"
      )}
    >
      <SearchInput
        placeholder="Search tables and columns..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-3"
      />
      <ul className={cn(layoutPatterns.flexCol, "flex-1 overflow-y-auto gap-1")}>
        {tables.map((table) => (
          <li key={table.table_name} className="relative group">
            <Button
              variant={selected === table.table_name ? "primary" : "ghost"}
              size="sm"
              onClick={() => onSelect(table.table_name)}
              className={cn(
                "w-full text-left justify-start",
                selected === table.table_name && "bg-primary-50 dark:bg-primary-950"
              )}
              aria-label={`View details for table ${table.table_name}`}
            >
              <span className={cn(layoutPatterns.flexCenter, "w-full justify-start")}>
                <span className="mr-2">🗄️</span>
                <Text 
                  as="span" 
                  variant={selected === table.table_name ? "primary" : "muted"} 
                  className="truncate max-w-[10rem] inline-block align-bottom"
                >
                  {highlight(table.table_name, filter)}
                </Text>
              </span>
              {filter && columnMatches[table.table_name]?.length > 0 && (
                <Text 
                  as="span" 
                  size="xs" 
                  variant="muted" 
                  className="ml-6 mt-0.5"
                >
                  ({columnMatches[table.table_name].length} col match{columnMatches[table.table_name].length > 1 ? 'es' : ''})
                </Text>
              )}
            </Button>
            {/* Tooltip using group hover */}
            <div className={cn(
              "hidden group-hover:block absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50",
              "bg-black text-white rounded px-2 py-1 shadow-lg whitespace-pre-line max-w-xs pointer-events-none"
            )}>
              <Text size="xs" variant="light">{table.table_name}</Text>
            </div>
          </li>
        ))}
      </ul>
    </Card>
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
    <div className={cn(layoutPatterns.flexCenter, "flex-1")}>
      <Text variant="muted">Select a table to view details</Text>
    </div>
  );
  
  return (
    <Card variant="glass" className={cn(layoutPatterns.spacing.lg, "flex-1 p-8 rounded-l-none")}>
      <Heading 
        level={2} 
        variant="primary" 
        weight="bold" 
        spacing="md"
        className={cn(layoutPatterns.flexCenter, "gap-2 justify-start")}
      >
        🗄️ <span className="break-words whitespace-pre-line">{highlight(table.table_name, filter)}</span>
      </Heading>
      <Text variant="muted" className="mb-2">Columns:</Text>
      <ul className={cn(layoutPatterns.spacing.sm)}>
        {table.columns.map((col) => {
          const isMatch = filter && col.name.toLowerCase().includes(filter.toLowerCase());
          return (
            <li key={col.name} className={cn(layoutPatterns.flexCenter, "gap-2 justify-start")}>
              <Text 
                as="span" 
                variant="primary" 
                className={cn("font-mono", isMatch && "font-semibold")}
              >
                {highlight(col.name, filter)}
              </Text>
              <Text size="xs" variant="muted">({col.data_type}{col.is_nullable ? ", nullable" : ""})</Text>
            </li>
          );
        })}
      </ul>
    </Card>
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
    <Container maxWidth="7xl" className="py-8">
      <Card variant="glass" className={cn(
        layoutPatterns.flexRow,
        "w-full max-w-5xl h-[600px] rounded-xl shadow-xl overflow-hidden"
      )}>
        <TableSidebar 
          tables={filteredTables} 
          selected={selected} 
          onSelect={setSelected} 
          filter={filter} 
          setFilter={setFilter} 
          columnMatches={columnMatches} 
        />
        {loading ? (
          <div className={cn(layoutPatterns.flexCenter, "flex-1")}>
            <Text variant="muted">Loading schema...</Text>
          </div>
        ) : error ? (
          <div className={cn(layoutPatterns.flexCenter, "flex-1")}>
            <Text variant="error" weight="semibold">{error}</Text>
          </div>
        ) : (
          <TableDetails table={selectedTable} filter={filter} />
        )}
      </Card>
    </Container>
  );
} 