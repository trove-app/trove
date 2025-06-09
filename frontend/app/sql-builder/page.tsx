"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import SqlResultTable from "./SqlResultTable";
import SqlEditor from "./SqlEditor";
import VisualSqlBuilder from "./VisualSqlBuilder";
import {
  SqlBuilderProvider,
  useSqlBuilder,
} from "../context/SqlBuilderContext";
import type { VisualSqlBuilderHandle } from "./VisualSqlBuilder";
import { formatSql } from "../utils/sqlUtils";
import { useSqlQuery } from "../hooks/useSqlQuery";
import { FaPlay, FaSpinner } from "react-icons/fa";
import ErrorToast from "../components/ErrorToast";

function SqlBuilderInner() {
  const [showEditor, setShowEditor] = useState(true);
  const [mode, setMode] = useState<"written" | "visual">("written");
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { sql, queryState, setQueryState, updateFromVisual, updateFromSql } =
    useSqlBuilder();
  const { result, loading, error, executeQuery, setError } = useSqlQuery(sql, () => setShowEditor(false));

  // Ref to access VisualSqlBuilder's latest SQL
  const visualBuilderRef = useRef<VisualSqlBuilderHandle>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    const newHeight = content.offsetHeight;
    wrapper.style.height = wrapper.offsetHeight + "px";
    void wrapper.offsetHeight;
    wrapper.style.transition = "height 0.3s cubic-bezier(.4,1.2,.6,1)";
    wrapper.style.height = newHeight + "px";
    const handleTransitionEnd = () => {
      wrapper.style.height = "auto";
      wrapper.removeEventListener("transitionend", handleTransitionEnd);
    };
    wrapper.addEventListener("transitionend", handleTransitionEnd);
  }, [mode, loading, error, sql]);

  const runQuery = async () => {
    try {
      const result = await executeQuery();
      if (result) {
        setShowEditor(false); // auto-collapse after successful query
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Query execution failed:', err);
    }
  };

  // Make sure we're passing an async function to SqlEditor
  const handleExecute = async () => {
    await runQuery();
  };

  // Clear error when SQL changes
  useEffect(() => {
    setError(null);
  }, [sql, setError]);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      <div className="w-full flex flex-col items-center">
        {/* Toggle Tabs - only show when editor is visible */}
        {showEditor && (
          <div className="w-full max-w-xl flex justify-center mb-2 mt-6">
            <div className="inline-flex rounded-xl bg-muted p-1 shadow-soft border border-border">
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:z-10
                  ${
                    mode === "written"
                      ? "bg-card text-accent shadow-soft border border-accent"
                      : "bg-transparent text-muted-foreground border border-transparent hover:bg-muted"
                  }`}
                onClick={() => {
                  if (
                    visualBuilderRef.current &&
                    visualBuilderRef.current.getSql
                  ) {
                    const rawSql = visualBuilderRef.current.getSql();
                    updateFromSql(formatSql(rawSql));
                  }
                  setMode("written");
                }}
                type="button"
                style={{ zIndex: mode === "written" ? 1 : 0 }}
              >
                Written
              </button>
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:z-10
                  ${
                    mode === "visual"
                      ? "bg-card text-accent shadow-soft border border-accent"
                      : "bg-transparent text-muted-foreground border border-transparent hover:bg-muted"
                  }`}
                onClick={() => setMode("visual")}
                type="button"
                style={{ zIndex: mode === "visual" ? 1 : 0 }}
              >
                Visual
              </button>
            </div>
          </div>
        )}
        <button
          className="fixed bottom-8 right-8 z-50 bg-accent text-accent-foreground px-5 py-2 rounded-full shadow-treasure font-bold hover:bg-primary-600 transition-colors"
          onClick={() => setShowEditor((v) => !v)}
        >
          {showEditor ? "Hide Query" : "Edit Query"}
        </button>
        <div
          className={`w-full max-w-3xl transition-all duration-300 overflow-hidden ${
            showEditor
              ? "h-[calc(100%-20rem)] opacity-100 mt-12 mb-2"
              : "max-h-0 opacity-0 mb-0 mt-0 pointer-events-none"
          }`}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <div style={{ height: 500, overflowY: "auto" }} className="relative">
                <section className="w-full h-full bg-card/80 rounded-2xl shadow-treasure p-8 border border-border flex flex-col">
                  {mode === "written" ? (
                    <SqlEditor 
                      value={sql} 
                      onChange={updateFromSql} 
                      onExecute={handleExecute}
                    />
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
                <ErrorToast 
                  message={error} 
                  onDismiss={() => setError(null)} 
                  duration={4000}
                />
              </div>
            </div>

            {/* Run Query Button - Right side */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={runQuery}
                  disabled={loading || !sql.trim()}
                  className="group flex items-center gap-2 px-4 py-2 bg-accent hover:bg-primary-600 text-accent-foreground rounded-lg shadow-treasure transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPlay className="group-hover:animate-pulse" />
                  )}
                  <span className="font-semibold">Run Query</span>
                </button>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'} + Enter
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="w-full">
          {result && (
            <SqlResultTable columns={result.columns} rows={result.rows} />
          )}
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
