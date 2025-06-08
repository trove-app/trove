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
import { Text, Container, Button, Card } from "../components/ui";
import { cn, layoutPatterns } from "../components/ui/utils";

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
    <Container maxWidth="full" className="px-6">
      <div className={cn(
        layoutPatterns.flexCol,
        "w-full"
      )}>
        {/* Mode toggle */}
        <div className={cn(
          "flex items-center gap-2 mt-6",
          "w-full justify-center"
        )}>
          <Button
            variant={mode === "written" ? "primary" : "ghost"}
            size="md"
            className={mode === "written" ? "shadow border border-primary" : ""}
            onClick={() => setMode("written")}
          >
            Written
          </Button>
          <Button
            variant={mode === "visual" ? "primary" : "ghost"}
            size="md"
            className={mode === "visual" ? "shadow border border-primary" : ""}
            onClick={() => setMode("visual")}
          >
            Visual
          </Button>
        </div>

        <div
          ref={wrapperRef}
          className={cn(
            "w-full transition-all duration-300 overflow-hidden",
            showEditor ? "max-h-[800px] opacity-100 mt-12 mb-2" : "max-h-0 opacity-0 mb-0 mt-0 pointer-events-none"
          )}
        >
          <div ref={contentRef} style={{ height: 600, overflowY: "auto" }}>
            <Card 
              variant="glass" 
              padding="lg"
              size="full"
            >
              {mode === "written" ? (
                <SqlEditor value={sql} onChange={updateFromSql} />
              ) : (
                <div className={cn(
                  "h-full",
                  layoutPatterns.flexCol,
                  "w-full"
                )}>
                  <VisualSqlBuilder
                    queryState={queryState}
                    setQueryState={setQueryState}
                    updateFromVisual={updateFromVisual}
                    ref={visualBuilderRef}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Shared submit button and error message */}
          <div className={cn(
            "w-full",
            layoutPatterns.flexCol,
            "items-end mt-2"
          )}>
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
    </Container>
  );
}

export default function SqlBuilder() {
  return (
    <SqlBuilderProvider>
      <SqlBuilderInner />
    </SqlBuilderProvider>
  );
}
