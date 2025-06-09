import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import { useSchema } from "../context/SchemaContext";
import { useSqlBuilder, type QueryState } from "../context/SqlBuilderContext";
import { useState as useLocalState } from "react";
import { FaArrowUp, FaArrowDown, FaPlus, FaTrash, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";
import IconButton from "../components/IconButton";

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
  const handleOrderByChange = (idx: number, field: string, value: string) => {
    const newOrderBy = queryState.orderBy.map((o, i) =>
      i === idx ? { ...o, [field]: value } : o
    ) as { table: string; column: string; direction: "ASC" | "DESC" }[];
    const newState = { ...queryState, orderBy: newOrderBy };
    setQueryState(newState);
    updateFromVisual(newState);
  };

  return (
    <div className="w-full max-w-full mx-auto bg-card rounded-2xl shadow-treasure p-5 flex flex-col gap-5 border border-border overflow-x-auto h-[575px]">
      {/* Table selection */}
      <div>
        <label
          htmlFor="table-select"
          className="block font-semibold mb-1 text-foreground"
        >
          Data Table
        </label>
        <select
          id="table-select"
          className="w-full rounded-lg border px-3 py-2 bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          value={selectedTable}
          onChange={(e) => {
            setQueryState((prev) => ({ ...prev, table: e.target.value }));
          }}
          disabled={loading || !!error || tables.length === 0}
          aria-label="Select the main data table"
          title="Pick the main table you want to explore."
        >
          <option value="" disabled>
            Select a table...
          </option>
          {tables.map((t) => (
            <option key={t.table_name} value={t.table_name}>
              {t.table_name}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-1" />

      {/* Joins UI */}
      {selectedTable && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-semibold text-foreground">
              Join Tables
            </label>
            <IconButton
              icon={FaPlus}
              label="Add Join"
              onClick={handleAddJoin}
              variant="primary"
            />
          </div>
          {joins.map((join, idx) => (
            <div
              key={idx}
              className="flex flex-wrap gap-2 items-center mb-2 p-2 rounded-lg bg-muted border border-border"
            >
              <select
                className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={join.table}
                onChange={(e) =>
                  handleJoinChange(idx, "table", e.target.value)
                }
              >
                {tables
                  .filter((t) => t.table_name !== selectedTable)
                  .map((t) => (
                    <option key={t.table_name} value={t.table_name}>
                      {t.table_name}
                    </option>
                  ))}
              </select>
              <span className="text-xs text-muted-foreground">ON</span>
              <select
                className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={join.baseColumn}
                onChange={(e) =>
                  handleJoinChange(idx, "baseColumn", e.target.value)
                }
              >
                {table?.columns.map((col) => (
                  <option key={col.name} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">=</span>
              <select
                className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={join.column}
                onChange={(e) =>
                  handleJoinChange(idx, "column", e.target.value)
                }
              >
                {tables
                  .find((t) => t.table_name === join.table)
                  ?.columns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name}
                    </option>
                  ))}
              </select>
              <IconButton
                icon={FaTrash}
                label="Remove Join"
                onClick={() => handleRemoveJoin(idx)}
                variant="destructive"
                className="ml-auto"
              />
            </div>
          ))}
        </div>
      )}

      {/* Column Selection */}
      {selectedTable && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-semibold text-foreground">
              Select Columns
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-accent hover:text-primary-600 underline"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                type="button"
                className="text-xs text-accent hover:text-primary-600 underline"
                onClick={handleSelectNone}
              >
                Clear
              </button>
            </div>
          </div>
          {joinedTables.map((t) => {
            const meta = tables.find((tab) => tab.table_name === t.table_name);
            if (!meta) return null;
            return (
              <div key={t.table_name} className="mb-1">
                <div className="mb-1 text-xs font-semibold text-foreground flex items-center gap-2">
                  <span className="uppercase tracking-wide">
                    {t.table_name}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    ({tableAliases[t.table_name]})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meta.columns.map((col) => {
                    const colObj = { table: t.table_name, column: col.name };
                    const checked = selectedColumns.some(
                      (c) => c.table === t.table_name && c.column === col.name
                    );
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleColumnToggle(colObj)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          checked
                            ? "bg-accent text-accent-foreground shadow-treasure"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {col.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Optional Settings */}
      <div className="mt-6">
        <div className="mb-2 text-lg font-bold text-foreground">
          Optional Settings
        </div>
        {/* Filters */}
        <div className="mb-4 bg-muted rounded-xl border border-border">
          <div
            role="button"
            tabIndex={0}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-accent focus:outline-none cursor-pointer"
            onClick={() => setShowFilters((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowFilters((v) => !v);
              }
            }}
          >
            <span>Filter Your Results (WHERE)</span>
            <IconButton
              icon={showFilters ? FaChevronUp : FaChevronDown}
              label={showFilters ? "Hide Filters" : "Show Filters"}
              variant="ghost"
              size="sm"
            />
          </div>
          {showFilters && (
            <div className="px-4 pb-4">
              {queryState.filters.length === 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  No filters added.
                </div>
              )}
              {queryState.filters.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap gap-2 items-center mb-2 p-2 rounded-lg bg-card border border-border"
                >
                  <select
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={f.table}
                    onChange={(e) =>
                      handleFilterChange(idx, "table", e.target.value)
                    }
                  >
                    {joinedTables.map((t) => (
                      <option key={t.table_name} value={t.table_name}>
                        {t.table_name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={f.column}
                    onChange={(e) =>
                      handleFilterChange(idx, "column", e.target.value)
                    }
                  >
                    {tables
                      .find((t) => t.table_name === f.table)
                      ?.columns.map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={f.op}
                    onChange={(e) =>
                      handleFilterChange(idx, "op", e.target.value)
                    }
                  >
                    {["=", "!=", "<", ">", "<=", ">=", "ILIKE"].map((op) => (
                      <option key={op} value={op}>
                        {op === "ILIKE" ? "contains" : op}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={f.value}
                    onChange={(e) =>
                      handleFilterChange(idx, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                  <IconButton
                    icon={FaTrash}
                    label="Remove Filter"
                    onClick={() => handleRemoveFilter(idx)}
                    variant="destructive"
                    className="ml-auto"
                  />
                </div>
              ))}
              <IconButton
                icon={FaPlus}
                label="Add Filter"
                onClick={handleAddFilter}
                variant="primary"
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* Order By */}
        <div className="mb-4 bg-muted rounded-xl border border-border">
          <div
            role="button"
            tabIndex={0}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-accent focus:outline-none cursor-pointer"
            onClick={() => setShowOrderBy((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowOrderBy((v) => !v);
              }
            }}
          >
            <span>Sort Results (ORDER BY)</span>
            <IconButton
              icon={showOrderBy ? FaChevronUp : FaChevronDown}
              label={showOrderBy ? "Hide Sort Options" : "Show Sort Options"}
              variant="ghost"
              size="sm"
            />
          </div>
          {showOrderBy && (
            <div className="px-4 pb-4">
              {queryState.orderBy.length === 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  No sorting applied.
                </div>
              )}
              {queryState.orderBy.map((o, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap gap-2 items-center mb-2 p-2 rounded-lg bg-card border border-border"
                >
                  <select
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={o.table}
                    onChange={(e) =>
                      handleOrderByChange(idx, "table", e.target.value)
                    }
                  >
                    {joinedTables.map((t) => (
                      <option key={t.table_name} value={t.table_name}>
                        {t.table_name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border px-2 py-1 text-xs bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={o.column}
                    onChange={(e) =>
                      handleOrderByChange(idx, "column", e.target.value)
                    }
                  >
                    {tables
                      .find((t) => t.table_name === o.table)
                      ?.columns.map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                  </select>
                  <IconButton
                    icon={o.direction === "ASC" ? FaArrowUp : FaArrowDown}
                    label={`Sort ${o.direction === "ASC" ? "Ascending" : "Descending"}`}
                    onClick={() => handleOrderByChange(idx, "direction", o.direction === "ASC" ? "DESC" : "ASC")}
                    variant="secondary"
                  />
                  <IconButton
                    icon={FaTrash}
                    label="Remove Sort"
                    onClick={() => handleRemoveOrderBy(idx)}
                    variant="destructive"
                    className="ml-auto"
                  />
                </div>
              ))}
              <IconButton
                icon={FaPlus}
                label="Add Sort"
                onClick={handleAddOrderBy}
                variant="primary"
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* Limit */}
        <div className="mb-4 bg-muted rounded-xl border border-border">
          <div
            role="button"
            tabIndex={0}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-accent focus:outline-none cursor-pointer"
            onClick={() => setShowLimit((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowLimit((v) => !v);
              }
            }}
          >
            <span>Limit Results</span>
            <IconButton
              icon={showLimit ? FaChevronUp : FaChevronDown}
              label={showLimit ? "Hide Limit" : "Show Limit"}
              variant="ghost"
              size="sm"
            />
          </div>
          {showLimit && (
            <div className="px-4 pb-4 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={10000}
                className="w-24 rounded-lg border px-3 py-2 bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={limit}
                onChange={(e) =>
                  setQueryState((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                  }))
                }
              />
              <span className="text-xs text-muted-foreground ml-1">
                (max rows)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SQL Preview Modal Trigger */}
      {generatedSql && (
        <div className="flex justify-end mt-1">
          <button
            type="button"
            className="text-xs text-accent hover:text-primary-600 underline focus:outline-none"
            onClick={() => setShowSqlModal(true)}
          >
            Show SQL
          </button>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40">
          <div className="bg-card rounded-xl shadow-treasure p-6 border border-border max-w-lg w-full relative overflow-x-auto">
            <IconButton
              icon={FaTimes}
              label="Close"
              onClick={() => setShowSqlModal(false)}
              variant="ghost"
              className="absolute top-3 right-3"
            />
            <div className="mb-4 text-sm font-semibold text-foreground">
              Generated SQL
            </div>
            <pre className="p-3 rounded-lg bg-muted border border-border text-xs font-mono text-foreground overflow-x-auto max-w-full whitespace-pre-wrap mb-3">
              {generatedSql}
            </pre>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold shadow-treasure hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>
        </div>
      )}

      {/* Loading/Error states */}
      {loading && (
        <div className="text-muted-foreground">
          Loading schema...
        </div>
      )}
      {error && <div className="text-error-600 font-semibold">{error}</div>}
    </div>
  );
});

export default VisualSqlBuilder;
