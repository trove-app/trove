"use client";
import React, { useState } from "react";
import SqlResultTable from "./SqlResultTable";
import { useSchema } from "../context/SchemaContext";
import SqlEditor from "./SqlEditor";

export default function SqlBuilder() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tables, loading: schemaLoading, error: schemaError, refresh } = useSchema();

  const runQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Query failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <h1 className="text-5xl font-extrabold mb-6 text-blue-600 dark:text-cyan-400">Trove SQL Runner</h1>
      <form onSubmit={runQuery} className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-4 border border-slate-200 dark:border-zinc-800 mb-6">
        <label htmlFor="sql" className="font-semibold text-lg text-slate-800 dark:text-zinc-100">SQL Query</label>
        <div className="w-full min-h-[120px]">
          <SqlEditor value={query} onChange={setQuery} />
        </div>
        <button
          type="submit"
          className="self-end px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
          disabled={loading || !query.trim()}
        >
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      {result && (
        <SqlResultTable columns={result.columns} rows={result.rows} />
      )}
    </main>
  );
}
