import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type { editor, languages } from "monaco-editor";
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
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);

  useEffect(() => {
    if (!monacoRef.current || !tables.length) return;
    const monaco = monacoRef.current;
    // Remove Monaco's default SQL suggestions if possible
    if (monaco.languages.sql?._providers?.completionItem) {
      monaco.languages.sql._providers.completionItem = [];
    }
    const disposable = monaco.languages.registerCompletionItemProvider("sql", {
      triggerCharacters: [" ", ".", ","],
      provideCompletionItems: (model: editor.ITextModel, position: editor.Position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const context = getSqlContext(textUntilPosition);
        const suggestions: languages.CompletionItem[] = [];
        if (context === "table") {
          for (const table of tables) {
            suggestions.push({
              label: table.table_name,
              kind: monaco.languages.CompletionItemKind.Struct,
              insertText: table.table_name,
              detail: "table",
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

  const handleMount: OnMount = (editor, monaco) => {
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