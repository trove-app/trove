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
import { format as sqlFormatter } from "sql-formatter";
import { Text, PageContainer, Button } from "../components/ui";

function SqlBuilderInner() {
  const [result, setResult] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [mode, setMode] = useState<"written" | "visual">("written");
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { sql, queryState, setQueryState, updateFromVisual, updateFromSql } =
    useSqlBuilder();

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
    <PageContainer>
      <div className="w-full flex flex-col items-center">
        {/* Toggle Tabs - only show when editor is visible */}
        {showEditor && (
          <div className="w-full max-w-xl flex justify-center mb-2 mt-6">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 shadow-sm border border-slate-200 dark:border-zinc-700">
              <Button
                variant={mode === "written" ? "primary" : "ghost"}
                size="md"
                onClick={() => {
                  // When switching to written mode, set query to latest SQL from visual builder
                  if (
                    visualBuilderRef.current &&
                    visualBuilderRef.current.getSql
                  ) {
                    const rawSql = visualBuilderRef.current.getSql();
                    updateFromSql(
                      sqlFormatter(rawSql, {
                        language: "sql",
                        keywordCase: "upper",
                      })
                    );
                  }
                  setMode("written");
                }}
                className={mode === "written" ? "shadow border border-primary" : "border border-transparent"}
                aria-label="Switch to written SQL mode"
              >
                <Text as="span" weight="semibold" className={mode === "written" ? "text-primary" : "text-muted"}>Written</Text>
              </Button>
              <Button
                variant={mode === "visual" ? "primary" : "ghost"}
                size="md"
                onClick={() => setMode("visual")}
                className={mode === "visual" ? "shadow border border-primary" : "border border-transparent"}
                aria-label="Switch to visual SQL builder mode"
              >
                <Text as="span" weight="semibold" className={mode === "visual" ? "text-primary" : "text-muted"}>Visual</Text>
              </Button>
            </div>
          </div>
        )}
        <Button
          variant="primary"
          size="lg"
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
          onClick={() => setShowEditor((v) => !v)}
          aria-label={showEditor ? "Hide query editor" : "Show query editor"}
        >
          <Text as="span" weight="bold" variant="light" className="text-white">
            {showEditor ? "Hide Query" : "Edit Query"}
          </Text>
        </Button>
        <div
          className={`w-full max-w-3xl transition-all duration-300 overflow-hidden ${
            showEditor
              ? "max-h-[800px] opacity-100 mt-12 mb-2"
              : "max-h-0 opacity-0 mb-0 mt-0 pointer-events-none"
          }`}
        >
          <div style={{ height: 600, overflowY: "auto" }}>
            <section className="w-full h-full bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-zinc-800 flex flex-col">
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
            <Button
              variant="primary"
              size="lg"
              onClick={runQuery}
              disabled={loading || !sql.trim()}
              aria-label="Execute SQL query"
            >
              <Text as="span" weight="bold" variant="light" className="text-white">
                {loading ? "Running..." : "Run Query"}
              </Text>
            </Button>
            {error && (
              <div className="self-start">
                <Text variant="error" weight="semibold">{error}</Text>
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
    </PageContainer>
  );
}

export default function SqlBuilder() {
  return (
    <SqlBuilderProvider>
      <SqlBuilderInner />
    </SqlBuilderProvider>
  );
}
