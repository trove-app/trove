"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import SqlResultTable from "./SqlResultTable";
import SqlEditor from "./SqlEditor";
import VisualSqlBuilder from "./VisualSqlBuilder";
import { SqlBuilderProvider, useSqlBuilder } from "../context/SqlBuilderContext";
import type { VisualSqlBuilderHandle } from "./VisualSqlBuilder";
import { format as sqlFormatter } from "sql-formatter";

function SqlBuilderInner() {
  const [result, setResult] = useState<{ columns: string[]; rows: Record<string, unknown>[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [mode, setMode] = useState<'written' | 'visual'>('written');
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { sql, setSql, queryState, setQueryState, updateFromVisual, updateFromSql } = useSqlBuilder();

  // Ref to access VisualSqlBuilder's latest SQL
  const visualBuilderRef = useRef<VisualSqlBuilderHandle>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    const newHeight = content.offsetHeight;
    wrapper.style.height = wrapper.offsetHeight + 'px';
    void wrapper.offsetHeight;
    wrapper.style.transition = 'height 0.3s cubic-bezier(.4,1.2,.6,1)';
    wrapper.style.height = newHeight + 'px';
    const handleTransitionEnd = () => {
      wrapper.style.height = 'auto';
      wrapper.removeEventListener('transitionend', handleTransitionEnd);
    };
    wrapper.addEventListener('transitionend', handleTransitionEnd);
  }, [mode, loading, error, sql]);

  const runQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Query failed");
      }
      const data = await res.json();
      setResult(data);
      setShowEditor(false); // auto-collapse after running query
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Unknown error");
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 px-4">
      <div className="w-full flex flex-col items-center">
        {/* Toggle Tabs - only show when editor is visible */}
        {showEditor && (
          <div className="w-full max-w-xl flex justify-center mb-2 mt-6">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 shadow-sm border border-slate-200 dark:border-zinc-700">
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10
                  ${mode === 'written'
                    ? 'bg-white dark:bg-zinc-900 text-blue-700 dark:text-blue-300 shadow border border-blue-500'
                    : 'bg-transparent text-slate-500 dark:text-zinc-400 border border-transparent hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                onClick={() => {
                  // When switching to written mode, set query to latest SQL from visual builder
                  if (visualBuilderRef.current && visualBuilderRef.current.getSql) {
                    const rawSql = visualBuilderRef.current.getSql();
                    setSql(sqlFormatter(rawSql, { language: "sql", keywordCase: "upper" }));
                  }
                  setMode('written');
                }}
                type="button"
                style={{ zIndex: mode === 'written' ? 1 : 0 }}
              >
                Written
              </button>
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10
                  ${mode === 'visual'
                    ? 'bg-white dark:bg-zinc-900 text-blue-700 dark:text-blue-300 shadow border border-blue-500'
                    : 'bg-transparent text-slate-500 dark:text-zinc-400 border border-transparent hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                onClick={() => setMode('visual')}
                type="button"
                style={{ zIndex: mode === 'visual' ? 1 : 0 }}
              >
                Visual
              </button>
            </div>
          </div>
        )}
        <button
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg font-bold hover:bg-blue-700 transition-colors"
          onClick={() => setShowEditor((v) => !v)}
        >
          {showEditor ? "Hide Query" : "Edit Query"}
        </button>
        <div
          className={`w-full max-w-3xl transition-all duration-300 overflow-hidden ${showEditor ? "max-h-[800px] opacity-100 mt-12 mb-2" : "max-h-0 opacity-0 mb-0 mt-0 pointer-events-none"}`}
        >
          <div style={{ height: 500, overflowY: 'auto' }}>
            <section className="w-full h-full bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-zinc-800 flex flex-col">
              {mode === 'written' ? (
                  <SqlEditor value={sql} onChange={setSql} />
              ) : (
                <div className="h-full flex flex-col max-w-full overflow-x-auto">
                  <VisualSqlBuilder
                    queryState={queryState}
                    setQueryState={setQueryState}
                    updateFromVisual={updateFromVisual}
                  />
                </div>
              )}
            </section>
          </div>
          {/* Shared submit button and error message */}
          <div className="w-full flex flex-col items-end mt-2">
            <button
              onClick={runQuery}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
              disabled={loading || !sql.trim()}
            >
              {loading
                ? ('Running...')
                : ('Run Query')}
            </button>
            {error && <div className="text-red-600 font-semibold mb-4 self-start">{error}</div>}
          </div>
        </div>
        <section className="w-full">
          {result && <SqlResultTable columns={result.columns} rows={result.rows} />}
        </section>
      </div>
    </main>
  );
}

export default function SqlBuilder() {
  return (
    <SqlBuilderProvider>
      <SqlBuilderInner />
    </SqlBuilderProvider>
  );
}
