import { useState, useEffect, useCallback, useRef } from 'react';
import { queryCache as baseQueryCache, LRUCache } from '../utils/QueryCache';

interface SqlResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

// Use a typed version of the shared queryCache for SqlResult
const queryCache: LRUCache<string, SqlResult> = baseQueryCache as LRUCache<string, SqlResult>;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSqlQuery(sql: string, onQueryComplete?: () => void) {
  const [result, setResult] = useState<SqlResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  
  // Keep a ref to the latest SQL value
  const sqlRef = useRef(sql);
  useEffect(() => {
    sqlRef.current = sql;
  }, [sql]);

  const executeQuery = useCallback(async (query: string = sqlRef.current) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFromCache(false);
    // Check cache first
    const cacheEntry = queryCache.get(query);
    const now = Date.now();
    if (cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
      setResult(cacheEntry.value);
      setFromCache(true);
      setLoading(false);
      onQueryComplete?.();
      return cacheEntry.value;
    }
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Query failed");
        return null;
      }
      setResult(data);
      setFromCache(false);
      // Update cache
      queryCache.set(query, data, now);
      onQueryComplete?.();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [onQueryComplete]);

  // Add keyboard shortcut handler
  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    // Check for Cmd/Ctrl + Enter
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      await executeQuery();
    }
  }, [executeQuery]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    result,
    loading,
    error,
    executeQuery,
    setResult,
    setError,
    fromCache,
  };
} 