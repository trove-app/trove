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
  const [showEditor, setShowEditor] = useState(true);

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
      setShowEditor(false); // auto-collapse after running query
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <div className="w-full flex flex-col items-center">
        <button
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg font-bold hover:bg-blue-700 transition-colors"
          onClick={() => setShowEditor((v) => !v)}
        >
          {showEditor ? "Hide Query" : "Edit Query"}
        </button>
        <div
          className={`w-full max-w-xl transition-all duration-300 overflow-hidden ${showEditor ? "max-h-[600px] opacity-100 mt-12 mb-2" : "max-h-0 opacity-0 mb-0 mt-0 pointer-events-none"}`}
        >
          <section className="w-full bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-zinc-800">
            <form onSubmit={runQuery} className="flex flex-col gap-4">
              <label htmlFor="sql" className="font-semibold text-lg text-slate-800 dark:text-zinc-100">SQL Query</label>
              <SqlEditor value={query} onChange={setQuery} />
              <button
                type="submit"
                className="self-end px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
                disabled={loading || !query.trim()}
              >
                {loading ? "Running..." : "Run Query"}
              </button>
              {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
            </form>
          </section>
        </div>
        <section className="w-full">
          {result && <SqlResultTable columns={result.columns} rows={result.rows} />}
        </section>
      </div>
    </main>
  );
}
