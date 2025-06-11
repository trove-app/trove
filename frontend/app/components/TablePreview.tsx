"use client";

import React, { useState, useEffect } from 'react';

interface TablePreviewProps {
  tableName: string | null;
}

interface QueryResponse {
  columns: string[];
  rows: Record<string, unknown>[];
  detail?: string; // For backend errors
}

export default function TablePreview({ tableName }: TablePreviewProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableName) {
      setColumns([]);
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setColumns([]);
      setRows([]);

      const query = `SELECT * FROM "${tableName}"`; // Enclose table name in double quotes

      try {
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, limit: 10 }),
        });

        const data: QueryResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || `Error fetching data: ${response.statusText}`);
        }

        if (data.columns && data.rows) {
          setColumns(data.columns);
          setRows(data.rows);
        } else if (data.detail) {
          // Handle cases where backend returns an error structure like { detail: "message" }
          // This can happen for query errors not caught by response.ok
          throw new Error(data.detail);
        } else {
          // Fallback for unexpected response structure
          setColumns([]);
          setRows([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load preview for ${tableName}: ${errorMessage}`);
        console.error(`[TablePreview] Error fetching data for ${tableName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  if (!tableName) {
    // This message is less prominent as it's a default state before selection.
    return <div className="p-4 text-sm text-muted-foreground">Select a table to see its preview.</div>;
  }

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading preview for {tableName}...</div>;
  }

  if (error) {
    // Using error colors from the theme (assuming text-error-500, bg-error-50, border-error-500/50 exist or can be mapped)
    return (
      <div className="p-4 text-error-700 dark:text-error-400 bg-error-50 dark:bg-error-900/30 border border-error-500/50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No data to preview for {tableName}. <br />
        (Table might be empty or the first 10 rows query returned no results)
      </div>
    );
  }

  return (
    // Using card background and theme shadow
    <div className="bg-card shadow-soft rounded-lg border border-border/50">
      {/* Removed explicit h3 title as it's already provided by DBExplorerPage's "Data Preview" heading */}
      {/* If a title specific to this component is needed, it can be added back, e.g.
      <h3 className="text-md font-semibold mb-3 px-4 pt-3 text-foreground/80">First 10 rows of {tableName}</h3>
      */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-left">
          <thead className="border-b border-border/50">
            <tr>
              {columns.map((colName) => (
                <th
                  key={colName}
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30 transition-colors duration-150">
                {columns.map((colName) => (
                  <td
                    key={`${rowIndex}-${colName}`}
                    className="px-4 py-3 whitespace-nowrap text-sm text-foreground leading-snug"
                  >
                    {String(row[colName])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
