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
import { Text, Button, IconButton, Card } from "../components/ui";
import { Select, Input, Tag, TagGroup } from "../components/ui/inputs";
import { cn, layoutPatterns } from "../components/ui/utils";

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
    <div className={cn(layoutPatterns.flexCol, "gap-6 w-full")}>
      {/* Table Selection */}
      <Card variant="glass" padding="lg" className="w-full" size="full">
        <div className={cn(layoutPatterns.flexCol, "gap-4")}>
          <Text weight="semibold" variant="primary">Select Table</Text>
          <Select
            value={selectedTable}
            onChange={(e) => {
              const newState = {
                ...queryState,
                table: e.target.value,
                columns: [],
                joins: [],
                filters: [],
                orderBy: [],
              };
              setQueryState(newState);
              updateFromVisual(newState);
            }}
            options={[
              { value: "", label: "Choose a table..." },
              ...tables.map((t) => ({
                value: t.table_name,
                label: t.table_name,
              })),
            ]}
          />
        </div>
      </Card>

      {/* Column Selection */}
      {table && (
        <Card variant="glass" padding="lg" className="w-full" size="full">
          <div className={cn(layoutPatterns.flexCol, "gap-4")}>
            <div className={cn(layoutPatterns.flexBetween)}>
              <Text weight="semibold" variant="primary">Select Columns</Text>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={allSelected}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectNone}
                  disabled={selectedColumns.length === 0}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className={cn(layoutPatterns.flexCol, "gap-2")}>
              {joinedTables.map((t) => {
                const tableMeta = tables.find(
                  (tab) => tab.table_name === t.table_name
                );
                if (!tableMeta) return null;
                return (
                  <div key={t.table_name} className={cn(layoutPatterns.flexCol, "gap-2")}>
                    <Text variant="muted" size="sm">{t.table_name}</Text>
                    <TagGroup
                      tags={tableMeta.columns.map((col) => ({
                        id: `${t.table_name}.${col.name}`,
                        label: col.name,
                        variant: "default"
                      }))}
                      selectedIds={selectedColumns
                        .filter((c) => c.table === t.table_name)
                        .map((c) => `${c.table}.${c.column}`)}
                      onSelectionChange={(ids) => {
                        const selected = ids.map((id) => {
                          const [table, column] = id.split(".");
                          return { table, column };
                        });
                        const newColumns = [
                          ...selectedColumns.filter((c) => c.table !== t.table_name),
                          ...selected,
                        ];
                        const newState = { ...queryState, columns: newColumns };
                        setQueryState(newState);
                        updateFromVisual(newState);
                      }}
                      selectable
                      multiSelect
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Joins */}
      {table && (
        <Card variant="glass" padding="lg" className="w-full" size="full">
          <div className={cn(layoutPatterns.flexCol, "gap-4")}>
            <div className={cn(layoutPatterns.flexBetween)}>
              <Text weight="semibold" variant="primary">Joins</Text>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddJoin}
                disabled={joins.length >= tables.length - 1}
              >
                Add Join
              </Button>
            </div>

            {joins.map((join, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Select
                  value={join.table}
                  onChange={(e) =>
                    handleJoinChange(idx, "table", e.target.value)
                  }
                  options={tables
                    .filter(
                      (t) =>
                        t.table_name !== selectedTable &&
                        !joins
                          .filter((_, i) => i !== idx)
                          .some((j) => j.table === t.table_name)
                    )
                    .map((t) => ({
                      value: t.table_name,
                      label: t.table_name,
                    }))}
                />
                <Text variant="muted">on</Text>
                <Select
                  value={join.baseColumn}
                  onChange={(e) =>
                    handleJoinChange(idx, "baseColumn", e.target.value)
                  }
                  options={
                    table?.columns.map((c) => ({
                      value: c.name,
                      label: c.name,
                    })) || []
                  }
                />
                <Text variant="muted">=</Text>
                <Select
                  value={join.column}
                  onChange={(e) =>
                    handleJoinChange(idx, "column", e.target.value)
                  }
                  options={
                    tables
                      .find((t) => t.table_name === join.table)
                      ?.columns.map((c) => ({
                        value: c.name,
                        label: c.name,
                      })) || []
                  }
                />
                <IconButton
                  icon={<FaTrash />}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveJoin(idx)}
                  aria-label="Remove join"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optional sections */}
      {table && (
        <>
          {/* Filters */}
          <Card variant="glass" padding="lg" className="w-full" size="full">
            <div className={cn(layoutPatterns.flexCol, "gap-4")}>
              <div className={cn(layoutPatterns.flexBetween)}>
                <Text weight="semibold" variant="primary">Filters</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddFilter}
                >
                  Add Filter
                </Button>
              </div>

              {queryState.filters.map((filter, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Select
                    value={filter.table}
                    onChange={(e) =>
                      handleFilterChange(idx, "table", e.target.value)
                    }
                    options={joinedTables.map((t) => ({
                      value: t.table_name,
                      label: t.table_name,
                    }))}
                  />
                  <Select
                    value={filter.column}
                    onChange={(e) =>
                      handleFilterChange(idx, "column", e.target.value)
                    }
                    options={
                      tables
                        .find((t) => t.table_name === filter.table)
                        ?.columns.map((c) => ({
                          value: c.name,
                          label: c.name,
                        })) || []
                    }
                  />
                  <Select
                    value={filter.op}
                    onChange={(e) =>
                      handleFilterChange(idx, "op", e.target.value)
                    }
                    options={[
                      { value: "=", label: "=" },
                      { value: "!=", label: "!=" },
                      { value: ">", label: ">" },
                      { value: "<", label: "<" },
                      { value: ">=", label: ">=" },
                      { value: "<=", label: "<=" },
                      { value: "LIKE", label: "LIKE" },
                      { value: "ILIKE", label: "ILIKE" },
                      { value: "IN", label: "IN" },
                    ]}
                  />
                  <Input
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(idx, "value", e.target.value)
                    }
                    placeholder="Value..."
                  />
                  <IconButton
                    icon={<FaTrash />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(idx)}
                    aria-label="Remove filter"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Order By */}
          <Card variant="glass" padding="lg" className="w-full" size="full">
            <div className={cn(layoutPatterns.flexCol, "gap-4")}>
              <div className={cn(layoutPatterns.flexBetween)}>
                <Text weight="semibold" variant="primary">Order By</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOrderBy}
                >
                  Add Sort
                </Button>
              </div>

              {queryState.orderBy.map((order, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Select
                    value={order.table}
                    onChange={(e) =>
                      handleOrderByChange(idx, "table", e.target.value)
                    }
                    options={joinedTables.map((t) => ({
                      value: t.table_name,
                      label: t.table_name,
                    }))}
                  />
                  <Select
                    value={order.column}
                    onChange={(e) =>
                      handleOrderByChange(idx, "column", e.target.value)
                    }
                    options={
                      tables
                        .find((t) => t.table_name === order.table)
                        ?.columns.map((c) => ({
                          value: c.name,
                          label: c.name,
                        })) || []
                    }
                  />
                  <IconButton
                    icon={order.direction === "ASC" ? <FaArrowUp /> : <FaArrowDown />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleOrderByDirection(idx)}
                    aria-label={`Toggle sort direction (currently ${order.direction})`}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOrderBy(idx)}
                    aria-label="Remove sort"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Limit */}
          <Card variant="glass" padding="lg" className="w-full" size="full">
            <div className={cn(layoutPatterns.flexCol, "gap-4")}>
              <Text weight="semibold" variant="primary">Limit Results</Text>
              <Input
                type="number"
                value={limit || ""}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : 0;
                  const newState = { ...queryState, limit: val };
                  setQueryState(newState);
                  updateFromVisual(newState);
                }}
                placeholder="No limit"
                min={1}
              />
            </div>
          </Card>
        </>
      )}

      {/* SQL Preview Modal Trigger */}
      {generatedSql && (
        <div className="flex justify-end mt-1">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowSqlModal(true)}
          >
            <Text size="xs" variant="link">Show SQL</Text>
          </Button>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-zinc-700 max-w-lg w-full relative overflow-x-auto">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setShowSqlModal(false)}
              aria-label="Close SQL preview"
              className="absolute top-3 right-3"
              icon={<Text weight="bold" variant="interactive">×</Text>}
            />
            <Text size="sm" weight="semibold" variant="primary" className="mb-4">
              Generated SQL
            </Text>
            <pre className="p-3 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-x-auto max-w-full whitespace-pre-wrap mb-2">
              <Text as="span" variant="primary" size="xs" className="font-mono">{generatedSql}</Text>
            </pre>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              aria-label="Copy SQL to clipboard"
            >
              <Text size="xs" weight="semibold" variant="light" className="text-white">Copy SQL</Text>
            </Button>
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
