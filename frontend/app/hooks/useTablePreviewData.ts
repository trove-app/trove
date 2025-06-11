"use client"; // Assuming this hook might be used in client components

import { useState, useEffect } from 'react';

export interface PreviewData {
  columns: string[];
  rows: Record<string, unknown>[];
}

interface QueryResponse extends PreviewData {
  detail?: string; // For backend errors
}

export default function useTablePreviewData(tableName: string | null, limit: number = 10) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableName) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null); // Clear previous data

      // Ensure limit is a positive integer
      const effectiveLimit = Math.max(1, Math.floor(limit));

      const query = `SELECT * FROM "${tableName}" LIMIT ${effectiveLimit}`;

      try {
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // The body includes both the full query with LIMIT and the separate limit param
          // as per backend expectations.
          body: JSON.stringify({ query, limit: effectiveLimit }),
        });

        const responseData: QueryResponse = await response.json();

        if (!response.ok) {
          throw new Error(responseData.detail || `Error fetching data: ${response.statusText} (status ${response.status})`);
        }

        if (responseData.columns && responseData.rows) {
          setData({ columns: responseData.columns, rows: responseData.rows });
        } else if (responseData.detail) {
          // This case might be redundant if !response.ok already caught it, but good for safety.
          throw new Error(responseData.detail);
        } else {
          // Fallback for unexpected successful response structure
          throw new Error('Received malformed data from server.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load preview for ${tableName}: ${errorMessage}`);
        console.error(`[useTablePreviewData] Error fetching data for ${tableName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, limit]);

  return { data, loading, error };
}
