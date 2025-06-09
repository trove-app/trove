"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
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

function SqlBuilderInner() {
  const [showEditor, setShowEditor] = useState(true);
  const [mode, setMode] = useState<"written" | "visual">("written");
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { sql, queryState, setQueryState, updateFromVisual, updateFromSql } =
    useSqlBuilder();
  const { result, loading, error, executeQuery } = useSqlQuery();

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

  const runQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await executeQuery(sql);
      setShowEditor(false); // auto-collapse after running query
    } catch {
      // Error is handled by the hook
    }
  };

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
          <div style={{ height: 500, overflowY: "auto" }}>
            <section className="w-full h-full bg-card/80 rounded-2xl shadow-treasure p-8 border border-border flex flex-col">
              {mode === "written" ? (
                <SqlEditor value={sql} onChange={updateFromSql} />
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
              className="px-6 py-2 rounded-lg bg-accent text-accent-foreground font-bold hover:bg-primary-600 disabled:opacity-60 shadow-treasure"
              disabled={loading || !sql.trim()}
            >
              {loading ? "Running..." : "Run Query"}
            </button>
            {error && (
              <div className="text-error-600 font-semibold mb-4 self-start">
                {error}
              </div>
            )}
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
