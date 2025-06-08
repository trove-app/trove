import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import { useSchema } from "../context/SchemaContext";
import { useSqlBuilder, type QueryState } from "../context/SqlBuilderContext";
import { useState as useLocalState } from "react";
import { FaArrowUp, FaArrowDown, FaPlus, FaTrash } from "react-icons/fa";
import { Text } from "../components/ui";
import { Select, Input, Tag, TagGroup } from "../components/ui/inputs";

interface VisualSqlBuilderProps {
  queryState: QueryState;
  setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  updateFromVisual: (state: QueryState) => void;
}

export type VisualSqlBuilderHandle = {
  getSql: () => string;
};

const VisualSqlBuilder = forwardRef<
  VisualSqlBuilderHandle,
  VisualSqlBuilderProps
>(function VisualSqlBuilder(
  { queryState, setQueryState, updateFromVisual },
  ref
) {
  const { tables, loading, error } = useSchema();
  const [generatedSql, setGeneratedSql] = useState<string>("");
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { generateSql} = useSqlBuilder();
  const {
    table: selectedTable,
    columns: selectedColumns,
    joins,
    limit,
  } = queryState;

  const table = tables.find((t) => t.table_name === selectedTable);
  // Build a list of all tables in the query (base + joins)
  const joinedTables = [
    ...(selectedTable ? [{ table_name: selectedTable }] : []),
    ...joins.map((j) => ({ table_name: j.table })),
  ];
  // Assign aliases: t0, t1, ...
  const tableAliases: Record<string, string> = {};
  joinedTables.forEach((t, i) => {
    tableAliases[t.table_name] = `t${i}`;
  });
  // Build all columns from all tables
  const allTableColumns = joinedTables
    .map((t) => {
      const meta = tables.find((tab) => tab.table_name === t.table_name);
      return meta
        ? meta.columns.map((col) => ({ table: t.table_name, column: col.name }))
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
      (c) => c.table === colObj.table && c.column === colObj.column
    );
    let newColumns;
    if (exists) {
      newColumns = selectedColumns.filter(
        (c) => !(c.table === colObj.table && c.column === colObj.column)
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
    const joinTable = tables.find((t) => t.table_name !== selectedTable);
    if (!joinTable || !table) return;
    const newJoins = [
      ...joins,
      {
        type: "LEFT",
        table: joinTable.table_name,
        baseColumn: table.columns[0]?.name || "",
        column: joinTable.columns[0]?.name || "",
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

  // Update generated SQL and notify parent on any change
  useEffect(() => {
    const sql = generateSql(queryState);
    setGeneratedSql(sql);
    // No onChange, parent is updated via updateFromVisual
  }, [queryState, generateSql]);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useImperativeHandle(
    ref,
    () => ({
      getSql: () => generatedSql,
    }),
    [generatedSql]
  );

  // Local UI state for collapsible optionals
  const [showFilters, setShowFilters] = useLocalState(false);
  const [showOrderBy, setShowOrderBy] = useLocalState(false);
  const [showLimit, setShowLimit] = useLocalState(false);

  // Filter logic
  const handleAddFilter = () => {
    // Default to first table/column
    const firstTable = joinedTables[0]?.table_name;
    const firstCol =
      tables.find((t) => t.table_name === firstTable)?.columns[0]?.name || "";
    const newFilter = {
      table: firstTable,
      column: firstCol,
      op: "ILIKE",
      value: "",
    };
    const newState = {
      ...queryState,
      filters: [...queryState.filters, newFilter],
    };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleRemoveFilter = (idx: number) => {
    const newFilters = queryState.filters.filter((_, i) => i !== idx);
    const newState = { ...queryState, filters: newFilters };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleFilterChange = (idx: number, field: string, value: string) => {
    const newFilters = queryState.filters.map((f, i) =>
      i === idx ? { ...f, [field]: value } : f
    );
    const newState = { ...queryState, filters: newFilters };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  // Order By logic
  const handleAddOrderBy = () => {
    const firstTable = joinedTables[0]?.table_name;
    const firstCol =
      tables.find((t) => t.table_name === firstTable)?.columns[0]?.name || "";
    const newOrder = {
      table: firstTable,
      column: firstCol,
      direction: "ASC" as "ASC" | "DESC",
    };
    const newState = {
      ...queryState,
      orderBy: [...queryState.orderBy, newOrder],
    };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleRemoveOrderBy = (idx: number) => {
    const newOrderBy = queryState.orderBy.filter((_, i) => i !== idx);
    const newState = { ...queryState, orderBy: newOrderBy };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleToggleOrderByDirection = (idx: number) => {
    const newOrderBy = queryState.orderBy.map((o, i) =>
      i === idx
        ? { ...o, direction: o.direction === "ASC" ? "DESC" : "ASC" }
        : o
    ) as { table: string; column: string; direction: "ASC" | "DESC" }[];
    const newState = { ...queryState, orderBy: newOrderBy };
    setQueryState(newState);
    updateFromVisual(newState);
  };
  const handleOrderByChange = (idx: number, field: string, value: string) => {
    const newOrderBy = queryState.orderBy.map((o, i) => {
      if (i !== idx) return o;
      if (field === "direction") {
        return {
          ...o,
          direction: (value === "DESC" ? "DESC" : "ASC") as "ASC" | "DESC",
        };
      }
      return { ...o, [field]: value };
    }) as { table: string; column: string; direction: "ASC" | "DESC" }[];
    const newState = { ...queryState, orderBy: newOrderBy };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  return (
    <div className="w-full max-w-full mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-5 flex flex-col gap-5 border border-slate-200 dark:border-zinc-800 overflow-x-auto h-[575px]">
      {/* Table selection */}
      <div>
        <Select
          id="table-select"
          label="Data Table"
          placeholder="Select a table..."
          value={selectedTable}
          onChange={(e) => {
            setQueryState((prev) => ({ ...prev, table: e.target.value }));
          }}
          disabled={loading || !!error || tables.length === 0}
          aria-label="Select the main data table"
          title="Pick the main table you want to explore."
          options={tables.map((t) => ({
            value: t.table_name,
            label: t.table_name
          }))}
          size="md"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-zinc-800 my-1" />

      {/* Joins UI (moved above columns) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Text weight="semibold" variant="primary">Combine Tables (JOIN)</Text>
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 shadow"
            onClick={handleAddJoin}
            disabled={!selectedTable || tables.length < 2}
            title={
              !selectedTable
                ? "Select a main table first"
                : tables.length < 2
                ? "Need at least two tables to combine"
                : "Add another table to combine"
            }
          >
            <Text as="span" variant="light" size="xs" className="text-white">+ Add Table</Text>
          </button>
        </div>
        {joins.length === 0 && (
          <div className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
            <Text size="xs" variant="muted" className="mb-2">
              Join tables to combine their data
            </Text>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {joins.map((join, idx) => {
            const joinTable = tables.find((t) => t.table_name === join.table);
            const baseTable = tables.find(
              (t) => t.table_name === selectedTable
            );
            return (
              <div
                key={idx}
                className="flex flex-wrap items-center gap-2 mb-1 bg-white dark:bg-zinc-900 rounded-lg p-2 shadow-sm border border-slate-200 dark:border-zinc-800"
              >
                {/* Table to combine */}
                <Select
                  size="sm"
                  className="min-w-[150px]"
                  value={join.table}
                  onChange={(e) => {
                    const newTable = e.target.value;
                    const newJoinTable = tables.find(
                      (t) => t.table_name === newTable
                    );
                    setQueryState((prev) => ({
                      ...prev,
                      joins: prev.joins.map((j, i) =>
                        i === idx
                          ? {
                              ...j,
                              table: newTable,
                              column: newJoinTable?.columns[0]?.name || "",
                            }
                          : j
                      ),
                    }));
                  }}
                  aria-label="Select table to combine"
                  title="Pick another table to combine with your main table."
                  options={tables
                    .filter((t) => t.table_name !== selectedTable)
                    .map((t) => ({
                      value: t.table_name,
                      label: t.table_name
                    }))}
                />
                {/* Main table column */}
                <Select
                  size="sm"
                  className="min-w-[150px]"
                  value={join.baseColumn}
                  onChange={(e) =>
                    handleJoinChange(idx, "baseColumn", e.target.value)
                  }
                  aria-label="Select column from main table"
                  title="Pick a column from your main table to match with the other table."
                  options={baseTable?.columns.map((col) => ({
                    value: col.name,
                    label: col.name
                  })) || []}
                />
                <Text as="span" size="xs" variant="muted">matches</Text>
                {/* Other table column */}
                <Select
                  size="sm"
                  className="min-w-[150px]"
                  value={join.column}
                  onChange={(e) =>
                    handleJoinChange(idx, "column", e.target.value)
                  }
                  aria-label="Select column from other table"
                  title="Pick a column from the other table to match with your main table."
                  options={joinTable?.columns.map((col) => ({
                    value: col.name,
                    label: col.name
                  })) || []}
                />
                <button
                  type="button"
                  className="ml-2 p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-700"
                  onClick={() => handleRemoveJoin(idx)}
                  title="Remove this table combination"
                  aria-label="Remove combine"
                >
                  <Text variant="error">×</Text>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Columns multiselect (now for all tables, grouped by table) */}
      <div className="flex items-center justify-between mb-1 mt-4">
        <Text weight="semibold" variant="primary">Columns to Show</Text>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            onClick={handleSelectAll}
            disabled={allSelected}
          >
            <Text as="span" size="xs" variant="link">Select All</Text>
          </button>
          <button
            type="button"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
            onClick={handleSelectNone}
            disabled={selectedColumns.length === 0}
          >
            <Text as="span" size="xs" variant="muted">None</Text>
          </button>
        </div>
      </div>
      {joinedTables.length > 0 ? (
        <div className="flex flex-col gap-4">
          {joinedTables.map((t, idx) => {
            const meta = tables.find((tab) => tab.table_name === t.table_name);
            if (!meta) return null;
            // Color variants for tags
            const tagVariants = [
              'gold',     // base
              'success',  // join 1
              'warning',  // join 2
              'error',    // join 3
              'info',     // join 4
            ] as const;
            const tagVariant = tagVariants[idx % tagVariants.length];
            return (
              <div key={t.table_name} className="mb-1">
                <div className="mb-1 text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <Text size="xs" weight="semibold" variant="primary" className="uppercase tracking-wide">
                    {t.table_name}
                  </Text>
                  <Text size="xs" variant="muted">({tableAliases[t.table_name]})</Text>
                </div>
                <TagGroup 
                  tags={meta.columns.map((col) => {
                    const colObj = { table: t.table_name, column: col.name };
                    const checked = selectedColumns.some(
                      (c) => c.table === t.table_name && c.column === col.name
                    );
                    return {
                      id: `${t.table_name}.${col.name}`,
                      label: col.name,
                      variant: checked ? tagVariant : 'default',
                      interactive: true,
                      onClick: () => handleColumnToggle(colObj),
                      className: "font-mono",
                      title: checked ? "Column will be shown in your results" : "Click to show this column in your results"
                    };
                  })}
                  gap="sm"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Text variant="muted" size="xs">NA</Text>
      )}

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-zinc-800 my-1" />

      {/* Optional Section */}
      <div className="mt-6">
        <Text size="lg" weight="bold" variant="primary">Optional Settings</Text>
        {/* Filters */}
        <div className="mb-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Text weight="semibold" variant="primary">Filter Results</Text>
            <Text>{showFilters ? "▲" : "▼"}</Text>
          </button>
          {showFilters && (
            <div className="px-4 pb-4">
              {queryState.filters.length === 0 && (
                <Text size="xs" variant="muted" className="mb-2">
                  No filters added.
                </Text>
              )}
              {queryState.filters.map((f, idx) => {
                const tableMeta = tables.find((t) => t.table_name === f.table);
                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 mb-2"
                  >
                    <Select
                      size="sm"
                      className="min-w-[120px]"
                      value={f.table}
                      onChange={(e) =>
                        handleFilterChange(idx, "table", e.target.value)
                      }
                      options={joinedTables.map((t) => ({
                        value: t.table_name,
                        label: t.table_name
                      }))}
                    />
                    <Select
                      size="sm"
                      className="min-w-[120px]"
                      value={f.column}
                      onChange={(e) =>
                        handleFilterChange(idx, "column", e.target.value)
                      }
                      options={tableMeta?.columns.map((c) => ({
                        value: c.name,
                        label: c.name
                      })) || []}
                    />
                    <Select
                      size="sm"
                      className="min-w-[100px]"
                      value={f.op}
                      onChange={(e) =>
                        handleFilterChange(idx, "op", e.target.value)
                      }
                      aria-label="Choose how to compare values"
                      options={[
                        { value: "=", label: "=" },
                        { value: "!=", label: "!=" },
                        { value: "<", label: "<" },
                        { value: ">", label: ">" },
                        { value: "<=", label: "<=" },
                        { value: ">=", label: ">=" },
                        { value: "ILIKE", label: "contains" }
                      ]}
                    />
                    <Input
                      size="sm"
                      className="min-w-[120px]"
                      value={f.value}
                      onChange={(e) =>
                        handleFilterChange(idx, "value", e.target.value)
                      }
                      placeholder="Value"
                      aria-label="Value to filter by"
                    />
                    <button
                      type="button"
                      className="text-xs underline hover:text-red-700 ml-2"
                      onClick={() => handleRemoveFilter(idx)}
                    >
                      <Text variant="error" size="xs">Remove</Text>
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 shadow"
                onClick={handleAddFilter}
              >
                <Text as="span" variant="light" size="xs" className="text-white">+ Add Filter</Text>
              </button>
            </div>
          )}
        </div>
        {/* Order By */}
        <div className="mb-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowOrderBy((v) => !v)}
          >
            <Text weight="semibold" variant="primary">Sort Results (Order By)</Text>
            <Text>{showOrderBy ? "▲" : "▼"}</Text>
          </button>
          {showOrderBy && (
            <div className="px-4 pb-4">
              {queryState.orderBy.length === 0 && (
                <Text size="xs" variant="muted" className="mb-2">
                  No sorting rules added.
                </Text>
              )}
              {queryState.orderBy.map((o, idx) => {
                const tableMeta = tables.find((t) => t.table_name === o.table);
                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 mb-2"
                  >
                    <Select
                      size="sm"
                      className="min-w-[120px]"
                      value={o.table}
                      onChange={(e) =>
                        handleOrderByChange(idx, "table", e.target.value)
                      }
                      options={joinedTables.map((t) => ({
                        value: t.table_name,
                        label: t.table_name
                      }))}
                    />
                    <Select
                      size="sm"
                      className="min-w-[120px]"
                      value={o.column}
                      onChange={(e) =>
                        handleOrderByChange(idx, "column", e.target.value)
                      }
                      options={tableMeta?.columns.map((c) => ({
                        value: c.name,
                        label: c.name
                      })) || []}
                    />
                    <Select
                      size="sm"
                      className="min-w-[100px]"
                      value={o.direction}
                      onChange={(e) =>
                        handleOrderByChange(idx, "direction", e.target.value)
                      }
                      options={[
                        { value: "ASC", label: "ASC" },
                        { value: "DESC", label: "DESC" }
                      ]}
                    />
                    <button
                      type="button"
                      className={`ml-2 p-1 rounded-full ${
                        o.direction === "ASC"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-yellow-100 dark:bg-yellow-900"
                      } hover:bg-blue-200 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-300 transition-colors`}
                      onClick={() => handleToggleOrderByDirection(idx)}
                      aria-label={
                        o.direction === "ASC"
                          ? "Sort ascending"
                          : "Sort descending"
                      }
                    >
                      {o.direction === "ASC" ? (
                        <FaArrowUp size={14} />
                      ) : (
                        <FaArrowDown size={14} />
                      )}
                    </button>
                    <button
                      type="button"
                      className="text-xs underline hover:text-red-700 ml-2"
                      onClick={() => handleRemoveOrderBy(idx)}
                    >
                      <Text variant="error" size="xs">Remove</Text>
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 shadow"
                onClick={handleAddOrderBy}
              >
                <Text as="span" variant="light" size="xs" className="text-white">+ Add Sort Rule</Text>
              </button>
            </div>
          )}
        </div>
        {/* Limit */}
        <div className="mb-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowLimit((v) => !v)}
          >
            <Text weight="semibold" variant="primary">Limit Results</Text>
            <Text>{showLimit ? "▲" : "▼"}</Text>
          </button>
          {showLimit && (
            <div className="px-4 pb-4 flex items-center gap-3">
              <Input
                id="limit-input"
                type="number"
                min={1}
                max={10000}
                size="md"
                className="w-24"
                value={limit.toString()}
                onChange={(e) =>
                  setQueryState((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                  }))
                }
                aria-label="Set maximum number of rows"
              />
              <div title="Maximum number of rows to return">
                <Text size="xs" variant="muted">(max rows)</Text>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SQL Preview Modal Trigger */}
      {generatedSql && (
        <div className="flex justify-end mt-1">
          <button
            type="button"
            className="focus:outline-none"
            onClick={() => setShowSqlModal(true)}
          >
            <Text size="xs" variant="link">Show SQL</Text>
          </button>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-zinc-700 max-w-lg w-full relative overflow-x-auto">
            <button
              type="button"
              className="absolute top-3 right-3 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowSqlModal(false)}
            >
              <Text weight="bold" variant="interactive">×</Text>
            </button>
            <Text size="sm" weight="semibold" variant="primary" className="mb-4">
              Generated SQL
            </Text>
            <pre className="p-3 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-x-auto max-w-full whitespace-pre-wrap mb-2">
              <Text as="span" variant="primary" size="xs" className="font-mono">{generatedSql}</Text>
            </pre>
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <Text size="xs" weight="semibold" variant="light" className="text-white">Copy SQL</Text>
            </button>
          </div>
        </div>
      )}

      {/* Loading/Error states */}
      {loading && (
        <Text variant="muted">Loading schema...</Text>
      )}
      {error && (
        <Text variant="error" weight="semibold">{error}</Text>
      )}
    </div>
  );
});

VisualSqlBuilder.displayName = "VisualSqlBuilder";

export default VisualSqlBuilder;
