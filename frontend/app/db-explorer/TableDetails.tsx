import React, { useEffect } from "react";
import type { ColumnMetadata } from "../context/SchemaContext";
import { useSqlQuery } from '../hooks/useSqlQuery';
import DataPreview from "./DataPreview";

interface Table {
  table_name: string;
  columns: ColumnMetadata[];
}

interface TableDetailsProps {
  table: Table | null;
  filter: string;
  onHover?: (info: { type: 'table' | 'column'; name: string; dataType?: string } | null) => void;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-accent/20 text-accent rounded-md px-1">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
}

const TableDetails = ({ table, filter, onHover }: TableDetailsProps) => {
  const {
    result: previewData,
    loading: previewLoading,
    error: previewError,
    executeQuery: executePreviewQuery,
    setResult: setPreviewResult
  } = useSqlQuery('');

  useEffect(() => {
    if (table?.table_name) {
      const queryString = `SELECT * FROM "${table.table_name}" LIMIT 5`;
      executePreviewQuery(queryString);
    } else {
      setPreviewResult(null);
    }
  }, [table?.table_name, executePreviewQuery, setPreviewResult]);

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
              <div className="w-3/5 p-3 pl-2 border-l border-border/30 min-h-[4.5rem]">
                <DataPreview
                  loading={previewLoading}
                  error={previewError}
                  previewData={previewData}
                  column={col}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export type { TableDetailsProps };
export default TableDetails; 