import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSchema } from "../context/SchemaContext";
import type { QueryState } from "../context/SqlBuilderContext";

interface VisualSqlBuilderProps {
  queryState: QueryState;
  setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  updateFromVisual: (state: QueryState) => void;
}

type Join = {
  type: string;
  table: string;
  baseColumn: string;
  column: string;
};

export type VisualSqlBuilderHandle = {
  getSql: () => string;
};

const VisualSqlBuilder = forwardRef<VisualSqlBuilderHandle, VisualSqlBuilderProps>(function VisualSqlBuilder({
  queryState,
  setQueryState,
  updateFromVisual,
}, ref) {
  const { tables, loading, error } = useSchema();
  const [generatedSql, setGeneratedSql] = useState<string>("");
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { table: selectedTable, columns: selectedColumns, joins, limit } = queryState;

  const table = tables.find(t => t.table_name === selectedTable);
  // Build a list of all tables in the query (base + joins)
  const joinedTables = [
    ...(selectedTable ? [{ table_name: selectedTable }] : []),
    ...joins.map(j => ({ table_name: j.table })),
  ];
  // Assign aliases: t0, t1, ...
  const tableAliases: Record<string, string> = {};
  joinedTables.forEach((t, i) => {
    tableAliases[t.table_name] = `t${i}`;
  });
  // Build all columns from all tables
  const allTableColumns = joinedTables
    .map(t => {
      const meta = tables.find(tab => tab.table_name === t.table_name);
      return meta
        ? meta.columns.map(col => ({ table: t.table_name, column: col.name }))
        : [];
    })
    .flat();
  const allSelected =
    allTableColumns.length > 0 &&
    selectedColumns.length === allTableColumns.length;

  const handleSelectAll = () => {
    const newState = { ...queryState, columns: allTableColumns };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleSelectNone = () => {
    const newState = { ...queryState, columns: [] };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleColumnToggle = (colObj: { table: string; column: string }) => {
    const exists = selectedColumns.some(
      c => c.table === colObj.table && c.column === colObj.column
    );
    let newColumns;
    if (exists) {
      newColumns = selectedColumns.filter(
        c => !(c.table === colObj.table && c.column === colObj.column)
      );
    } else {
      newColumns = [...selectedColumns, colObj];
    }
    const newState = { ...queryState, columns: newColumns };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  // Only LEFT JOIN supported for now

  // Add a new join row
  const handleAddJoin = () => {
    const joinTable = tables.find(t => t.table_name !== selectedTable);
    if (!joinTable || !table) return;
    const newJoins = [
      ...joins,
      {
        type: 'LEFT',
        table: joinTable.table_name,
        baseColumn: table.columns[0]?.name || '',
        column: joinTable.columns[0]?.name || '',
      },
    ];
    const newState = { ...queryState, joins: newJoins };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  // Remove a join row
  const handleRemoveJoin = (idx: number) => {
    const newJoins = joins.filter((_, i) => i !== idx);
    const newState = { ...queryState, joins: newJoins };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  // Update a join field
  const handleJoinChange = (idx: number, field: string, value: string) => {
    const newJoins = joins.map((j, i) =>
      i === idx ? { ...j, [field]: value } : j
    );
    const newState = { ...queryState, joins: newJoins };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  // Generate SQL from current selections
  function buildSql(table: string, columns: { table: string; column: string }[], limit: number, joins: Join[]) {
    if (!table) return "";
    // SELECT clause
    const cols =
      columns.length > 0
        ? columns
            .map(
              c =>
                `${tableAliases[c.table]}.${c.column} AS ${c.table}_${c.column}`
            )
            .join(", ")
        : "*";
    // FROM and JOINs
    let sql = `SELECT ${cols} FROM ${table} ${tableAliases[table]} `;
    joins.forEach((j: Join) => {
      sql += `LEFT JOIN ${j.table} ${tableAliases[j.table]} ON ${tableAliases[table]}.${j.baseColumn} = ${tableAliases[j.table]}.${j.column} `;
    });
    if (limit) sql += `LIMIT ${limit}`;
    return sql.trim();
  }

  // Update generated SQL and notify parent on any change
  useEffect(() => {
    const sql = buildSql(selectedTable, selectedColumns, limit, joins);
    setGeneratedSql(sql);
    // No onChange, parent is updated via updateFromVisual
  }, [selectedTable, selectedColumns, limit, joins]);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useImperativeHandle(ref, () => ({
    getSql: () => generatedSql,
  }), [generatedSql]);

  return (
    <div className="w-full max-w-full mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-5 flex flex-col gap-5 border border-slate-200 dark:border-zinc-800 overflow-x-auto h-[450px]">
      {/* Table selection */}
      <div>
        <label htmlFor="table-select" className="block font-semibold mb-1 text-slate-800 dark:text-zinc-100">Table <span className="text-xs text-slate-400 ml-1">(Choose a table to query)</span></label>
        <select
          id="table-select"
          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={selectedTable}
          onChange={e => {
            setQueryState(prev => ({ ...prev, table: e.target.value }));
          }}
          disabled={loading || !!error || tables.length === 0}
        >
          <option value="" disabled>Select a table...</option>
          {tables.map(t => (
            <option key={t.table_name} value={t.table_name}>{t.table_name}</option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-zinc-800 my-1" />

      {/* Joins UI (moved above columns) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-semibold text-slate-800 dark:text-zinc-100">Joins <span className="text-xs text-slate-400 ml-1">(Optional: add table joins)</span></label>
          <button
            type="button"
            className="underline text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 text-xs transition-colors"
            onClick={handleAddJoin}
            disabled={!selectedTable || tables.length < 2}
          >
            + Add Join
          </button>
        </div>
        {joins.length === 0 && (
          <div className="text-xs text-slate-500 dark:text-zinc-400 mb-2">No joins added.</div>
        )}
        <div className="flex flex-col gap-2">
          {joins.map((join, idx) => {
            const joinTable = tables.find(t => t.table_name === join.table);
            const baseTable = tables.find(t => t.table_name === selectedTable);
            return (
              <div key={idx} className="flex flex-wrap items-center gap-2 mb-1">
                {/* Table to join */}
                <select
                  className="rounded-lg border px-3 py-2 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={join.table}
                  onChange={e => {
                    const newTable = e.target.value;
                    const newJoinTable = tables.find(t => t.table_name === newTable);
                    setQueryState(prev => ({
                      ...prev,
                      joins: prev.joins.map((j, i) =>
                        i === idx
                          ? {
                              ...j,
                              table: newTable,
                              column: newJoinTable?.columns[0]?.name || ''
                            }
                          : j
                      )
                    }));
                  }}
                >
                  {tables.filter(t => t.table_name !== selectedTable).map(t => (
                    <option key={t.table_name} value={t.table_name}>{t.table_name}</option>
                  ))}
                </select>
                {/* Base table column */}
                <select
                  className="rounded-lg border px-3 py-2 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={join.baseColumn}
                  onChange={e => handleJoinChange(idx, 'baseColumn', e.target.value)}
                >
                  {baseTable?.columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <span className="text-slate-500 dark:text-zinc-400 text-xs">=</span>
                {/* Join table column */}
                <select
                  className="rounded-lg border px-3 py-2 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={join.column}
                  onChange={e => handleJoinChange(idx, 'column', e.target.value)}
                >
                  {joinTable?.columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-xs underline text-red-500 hover:text-red-700 transition-colors ml-2"
                  onClick={() => handleRemoveJoin(idx)}
                  title="Remove join"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Columns multiselect (now for all tables, grouped by table) */}
      <div className="flex items-center justify-between mb-1 mt-4">
        <label className="font-semibold text-slate-800 dark:text-zinc-100">Columns <span className="text-xs text-slate-400 ml-1">(Pick columns to include from any table)</span></label>
        <div className="flex gap-2 text-xs">
          <button type="button" className="underline text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors" onClick={handleSelectAll} disabled={allSelected}>Select All</button>
          <button type="button" className="underline text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors" onClick={handleSelectNone} disabled={selectedColumns.length === 0}>None</button>
        </div>
      </div>
      {joinedTables.length > 0 ? (
        <div className="flex flex-col gap-4">
          {joinedTables.map((t, idx) => {
            const meta = tables.find(tab => tab.table_name === t.table_name);
            if (!meta) return null;
            // Color palette for pills
            const pillColors = [
              'bg-blue-600 text-white border-blue-600', // base
              'bg-green-600 text-white border-green-600', // join 1
              'bg-yellow-500 text-white border-yellow-500', // join 2
              'bg-purple-600 text-white border-purple-600', // join 3
              'bg-pink-600 text-white border-pink-600', // join 4
              'bg-cyan-600 text-white border-cyan-600', // join 5
            ];
            const pillColor = pillColors[idx % pillColors.length];
            return (
              <div key={t.table_name} className="mb-1">
                <div className="mb-1 text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
                  <span className="uppercase tracking-wide">{t.table_name}</span>
                  <span className="text-slate-400 dark:text-zinc-500 text-[10px]">({tableAliases[t.table_name]})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meta.columns.map(col => {
                    const colObj = { table: t.table_name, column: col.name };
                    const checked = selectedColumns.some(c => c.table === t.table_name && c.column === col.name);
                    return (
                      <label
                        key={`${t.table_name}.${col.name}`}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono cursor-pointer select-none transition-all
                          ${checked
                            ? pillColor
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700 hover:border-blue-400'}
                        `}
                        tabIndex={0}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleColumnToggle(colObj)}
                          className="accent-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                          tabIndex={-1}
                        />
                        {col.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-s text-slate-600">NA</span>
      )}

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-zinc-800 my-1" />

      {/* Limit input */}
      <div className="flex items-center gap-3">
        <label htmlFor="limit-input" className="font-semibold text-slate-800 dark:text-zinc-100">Limit</label>
        <input
          id="limit-input"
          type="number"
          min={1}
          max={10000}
          className="w-24 rounded-lg border px-3 py-2 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={limit}
          onChange={e => setQueryState(prev => ({ ...prev, limit: Number(e.target.value) }))}
        />
        <span className="text-xs text-slate-400 ml-1" title="Maximum number of rows to return">(max rows)</span>
      </div>

      {/* SQL Preview Modal Trigger */}
      {generatedSql && (
        <div className="flex justify-end mt-1">
          <button
            type="button"
            className="text-xs text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-cyan-200 focus:outline-none"
            onClick={() => setShowSqlModal(true)}
          >
            Show SQL
          </button>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-zinc-700 max-w-lg w-full relative overflow-x-auto">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 text-lg font-bold focus:outline-none"
              onClick={() => setShowSqlModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4 text-sm font-semibold text-slate-700 dark:text-zinc-200">Generated SQL</div>
            <pre className="p-3 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-700 dark:text-zinc-200 overflow-x-auto max-w-full whitespace-pre-wrap mb-3">
              {generatedSql}
            </pre>
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? 'Copied!' : 'Copy SQL'}
            </button>
          </div>
        </div>
      )}

      {/* Loading/Error states */}
      {loading && <div className="text-slate-500 dark:text-zinc-400">Loading schema...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  );
});

export default VisualSqlBuilder; 