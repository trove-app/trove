import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";
import React, { useEffect, useRef } from "react";
import { useSchema } from "../context/SchemaContext";

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

export default function SqlEditor({ value, onChange }: SqlEditorProps) {
  const { tables } = useSchema();
  // The Monaco instance is only available at runtime, so we use 'unknown' for the ref
  type MonacoInstance = typeof import("monaco-editor");
  const monacoRef = useRef<unknown>(null);

  useEffect(() => {
    if (!monacoRef.current || !tables.length) return;
    const monaco = monacoRef.current as MonacoInstance;
    // Remove Monaco's default SQL suggestions if possible
    const languages = monaco.languages as unknown;
    if (
      typeof languages === "object" &&
      languages !== null &&
      "sql" in languages &&
      typeof (languages as Record<string, unknown>).sql === "object" &&
      (languages as Record<string, unknown>).sql !== null
    ) {
      const sql = (languages as Record<string, unknown>).sql as Record<string, unknown>;
      if (
        "_providers" in sql &&
        typeof (sql._providers) === "object" &&
        sql._providers !== null
      ) {
        const providers = sql._providers as Record<string, unknown>;
        if (
          "completionItem" in providers &&
          Array.isArray(providers.completionItem)
        ) {
          (providers.completionItem as unknown[]).length = 0;
        }
      }
    }
    const disposable = monaco.languages.registerCompletionItemProvider("sql", {
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
        if (context === "table") {
          for (const table of tables) {
            suggestions.push({
              label: table.table_name,
              kind: monaco.languages.CompletionItemKind.Struct,
              insertText: table.table_name,
              detail: "table",
              range,
            });
          }
        } else if (context === "column") {
          for (const table of tables) {
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
            const table = tables.find(t => t.table_name === tableName);
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
        return { suggestions };
      },
    });
    return () => disposable.dispose();
  }, [tables]);

  const handleMount: OnMount = (_editor, monaco) => {
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full min-h-[120px]">
      <MonacoEditor
        height="180px"
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={v => onChange(v || "")}
        onMount={handleMount}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
} 