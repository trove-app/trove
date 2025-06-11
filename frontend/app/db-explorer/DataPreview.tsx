import React from 'react';
import type { ColumnMetadata } from "../context/SchemaContext";

interface DataPreviewProps {
  loading: boolean;
  error: string | null;
  previewData: { rows: Record<string, unknown>[] } | null;
  column: ColumnMetadata;
  fromCache?: boolean;
}

export default function DataPreview({ loading, error, previewData, column, fromCache }: DataPreviewProps) {
  // Improved loading state: animated shimmer rows
  if (loading) {
    return (
      <div className="flex flex-col gap-1 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-muted/40 rounded w-3/4 mb-1" />
        ))}
        <div className="text-xs text-muted-foreground italic pt-1">Loading preview…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-error-600 dark:text-error-500 italic pt-1 truncate" title={error}>
        Error loading preview
      </div>
    );
  }

  if (previewData && previewData.rows.length > 0) {
    return (
      <div className="space-y-1 relative">
        {fromCache && (
          <div className="absolute top-0 right-0 text-[10px] text-accent bg-accent/10 px-1 py-0.5 rounded-bl-md rounded-tr-md font-mono z-10" title="Loaded from cache">
            cached
          </div>
        )}
        {previewData.rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="text-xs text-foreground/90 truncate font-mono max-w-full px-2 py-1 rounded bg-muted/10 hover:bg-muted/20 transition"
            title={row[column.name] !== null && row[column.name] !== undefined ? String(row[column.name]) : 'NULL'}
          >
            {row[column.name] !== null && row[column.name] !== undefined ? (
              <span>{String(row[column.name])}</span>
            ) : (
              <span className="italic text-muted-foreground/60">NULL</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (previewData && previewData.rows.length === 0) {
    return <div className="text-xs text-muted-foreground italic pt-1">No preview values</div>;
  }

  // Fallback for initial state before fetch or if data is null without error
  return <div className="text-xs text-muted-foreground italic pt-1">Preview N/A</div>;
} 