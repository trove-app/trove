import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";
import React, { useEffect, useRef } from "react";
import { useSchema } from "../context/SchemaContext";
import { getSqlContext, formatSql } from "../utils/sqlUtils";

// Declare global Monaco instance
declare global {
  interface Window {
    monaco: typeof MonacoType;
  }
}

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Track if the completion provider has been registered for this Monaco instance
let monacoSqlProviderRegistered = false;

const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange }) => {
  const { tables } = useSchema();
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null);
  // Ref to always have the latest tables in the provider
  const tablesRef = useRef(tables);

  useEffect(() => {
    tablesRef.current = tables;
  }, [tables]);

  // Format initial value on mount
  useEffect(() => {
    if (value && value !== formatSql(value)) {
      onChange(formatSql(value));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get current theme
  const getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark') ? 'trove-dark' : 'trove-light';
  };

  // Update editor theme when document theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (editorRef.current) {
        const monaco = window.monaco as typeof MonacoType;
        if (monaco) {
          monaco.editor.setTheme(getCurrentTheme());
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Set up Monaco editor theme
    monaco.editor.defineTheme("trove-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "A25D2D", fontStyle: "bold" },
        { token: "string", foreground: "84bd26" },
        { token: "number", foreground: "F4B100" },
        { token: "comment", foreground: "6b6b6b", fontStyle: "italic" },
        { token: "operator", foreground: "A25D2D" },
        { token: "delimiter", foreground: "2A2A2A" },
        { token: "identifier", foreground: "2A2A2A" },
      ],
      colors: {
        "editor.background": "#FFF7EC",
        "editor.foreground": "#2A2A2A",
        "editor.lineHighlightBackground": "#f8f4ea",
        "editorCursor.foreground": "#F4B100",
        "editor.selectionBackground": "#fdecc4",
        "editor.inactiveSelectionBackground": "#f2e8e5",
      },
    });

    monaco.editor.defineTheme("trove-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "F4B100", fontStyle: "bold" },
        { token: "string", foreground: "9dd13c" },
        { token: "number", foreground: "fbd788" },
        { token: "comment", foreground: "a0a0a0", fontStyle: "italic" },
        { token: "operator", foreground: "F4B100" },
        { token: "delimiter", foreground: "FFF7EC" },
        { token: "identifier", foreground: "FFF7EC" },
      ],
      colors: {
        "editor.background": "#1A1A1A",
        "editor.foreground": "#FFF7EC",
        "editor.lineHighlightBackground": "#2A2A2A",
        "editorCursor.foreground": "#F4B100",
        "editor.selectionBackground": "#3A3A3A",
        "editor.inactiveSelectionBackground": "#4A4A4A",
      },
    });

    // Set up SQL language configuration
    monaco.languages.setMonarchTokensProvider("sql", {
      defaultToken: "identifier",
      tokenizer: {
        root: [
          [/\s+/, "white"],
          [/--.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/'/, "string", "@string"],
          [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
          [/\d+/, "number"],
          [/[;,.]/, "delimiter"],
          [/[()[\]]/, "delimiter"],
          [/\b(SELECT|FROM|WHERE|JOIN|LEFT|INNER|RIGHT|ON|GROUP|BY|ORDER|LIMIT|OFFSET|AND|OR|NOT|IN|LIKE|ILIKE|IS|NULL|ASC|DESC|DISTINCT|HAVING|UNION|ALL|AS|WITH|CASE|WHEN|THEN|ELSE|END)\b/i, "keyword"],
          [/[<>=!]+/, "operator"],
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
        comment: [
          [/[^/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[/*]/, "comment"],
        ],
        string: [
          [/[^\\']+/, "string"],
          [/'/, "string", "@pop"],
        ],
      },
    });

    // Set up SQL completion provider
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
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

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

          // Add SQL keywords
          const keywords = [
            "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "INNER JOIN",
            "GROUP BY", "ORDER BY", "LIMIT", "OFFSET", "AND", "OR",
            "NOT", "IN", "LIKE", "ILIKE", "IS NULL", "IS NOT NULL",
            "ASC", "DESC"
          ];

          keywords.forEach((keyword) => {
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              detail: "Keyword",
              range,
            });
          });

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

    // Format SQL on editor blur
    editor.onDidBlurEditorWidget(() => {
      const currentValue = editor.getValue();
      const formattedValue = formatSql(currentValue);
      if (currentValue !== formattedValue) {
        editor.setValue(formattedValue);
      }
    });

    // Set initial theme
    monaco.editor.setTheme(getCurrentTheme());
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <MonacoEditor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          theme: getCurrentTheme(),
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default SqlEditor; 