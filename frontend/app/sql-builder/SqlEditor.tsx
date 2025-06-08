import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";
import React, { useEffect, useRef } from "react";
import { useSchema } from "../context/SchemaContext";
import { format as sqlFormatter } from "sql-formatter";
import { Text, Card } from "../components/ui";
import { cn } from "../components/ui/utils";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Helper to find the last relevant SQL keyword before the cursor
function getSqlContext(text: string) {
  // Remove comments and excessive whitespace
  const cleaned = text.replace(/--.*$/gm, "").replace(/\s+/g, " ");
  // Find the last keyword before the cursor
  const keywords = [
    "select", "from", "join", "where", "on", "and", "or", "into", "update", "insert", "set", "group by", "order by"
  ];
  let lastKeyword: string | null = null;
  let lastIndex = -1;
  for (const kw of keywords) {
    const idx = cleaned.toLowerCase().lastIndexOf(kw);
    if (idx > lastIndex) {
      lastKeyword = kw;
      lastIndex = idx;
    }
  }
  // Dot notation: table.column
  if (/\.[a-zA-Z0-9_]*$/.test(cleaned)) return "dot";
  const lastKw = lastKeyword || "";
  if (["from", "join", "into", "update"].includes(lastKw)) return "table";
  if (["select", "where", "on", "and", "or", "set", "group by", "order by"].includes(lastKw)) return "column";
  return null;
}

// Track if the completion provider has been registered for this Monaco instance
let monacoSqlProviderRegistered = false;

export default function SqlEditor({ value, onChange }: SqlEditorProps) {
  const { tables } = useSchema();
  const monacoRef = useRef<unknown>(null);
  // Ref to always have the latest tables in the provider
  const tablesRef = useRef(tables);

  useEffect(() => {
    tablesRef.current = tables;
  }, [tables]);

  // Format SQL using sql-formatter
  const formatSql = (sql: string) => {
    try {
      return sqlFormatter(sql, { language: "sql", keywordCase: "upper" });
    } catch {
      return sql; // fallback if formatting fails
    }
  };

  // Format initial value on mount
  useEffect(() => {
    if (value && value !== formatSql(value)) {
      onChange(formatSql(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only update value on change, do not format
  const handleChange = (v: string | undefined) => {
    if (typeof v === "string") {
      onChange(v);
    } else {
      onChange("");
    }
  };

  const handleMount: OnMount = (editor, monaco) => {
    monacoRef.current = monaco;
    // Register provider only once per Monaco instance
    if (!monacoSqlProviderRegistered) {
      monaco.languages.registerCompletionItemProvider("sql", {
        triggerCharacters: [" ", ".", ","],
        provideCompletionItems: (
          model: MonacoType.editor.ITextModel,
          position: MonacoType.Position
        ) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          const context = getSqlContext(textUntilPosition);
          const word = model.getWordUntilPosition(position);
          const range = new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          );
          const suggestions: MonacoType.languages.CompletionItem[] = [];
          const currentTables = tablesRef.current;
          if (context === "table") {
            for (const table of currentTables) {
              suggestions.push({
                label: table.table_name,
                kind: monaco.languages.CompletionItemKind.Struct,
                insertText: table.table_name,
                detail: "table",
                range,
              });
            }
          } else if (context === "column") {
            for (const table of currentTables) {
              for (const col of table.columns) {
                suggestions.push({
                  label: col.name,
                  kind: monaco.languages.CompletionItemKind.Field,
                  insertText: col.name,
                  detail: `${col.data_type}${col.is_nullable ? ", nullable" : ""} (${table.table_name})`,
                  range,
                });
              }
            }
          } else if (context === "dot") {
            // Suggest columns for the table before the dot
            const match = textUntilPosition.match(/([a-zA-Z0-9_]+)\.[a-zA-Z0-9_]*$/);
            if (match) {
              const tableName = match[1];
              const table = currentTables.find(t => t.table_name === tableName);
              if (table) {
                for (const col of table.columns) {
                  suggestions.push({
                    label: col.name,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: col.name,
                    detail: `${col.data_type}${col.is_nullable ? ", nullable" : ""} (${table.table_name})`,
                    range,
                  });
                }
              }
            }
          }
          // Deduplicate suggestions by label
          const uniqueSuggestions = [];
          const seen = new Set();
          for (const s of suggestions) {
            if (!seen.has(s.label)) {
              uniqueSuggestions.push(s);
              seen.add(s.label);
            }
          }
          return { suggestions: uniqueSuggestions };
        },
      });
      monacoSqlProviderRegistered = true;
    }
    // Attach blur event to format SQL
    editor.onDidBlurEditorWidget(() => {
      onChange(formatSql(editor.getValue()));
    });
  };

  return (
    <Card variant="glass" padding="none" className="w-full" size="full">
      <div className="flex items-center justify-between px-4 pt-4">
        <Text weight="semibold" variant="primary">SQL Query Editor</Text>
        <Text size="xs" variant="muted">Auto-formatting on blur</Text>
      </div>
      <MonacoEditor
        height="450px"
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </Card>
  );
} 