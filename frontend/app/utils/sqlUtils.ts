import { format as sqlFormatter } from "sql-formatter";
import type { QueryState, Join } from "../context/SqlBuilderContext";

interface TableColumn {
  name: string;
  data_type: string;
  is_nullable: boolean;
}

interface TableInfo {
  table_name: string;
  columns: TableColumn[];
}

export function generateTableAliases(tables: string[]): Record<string, string> {
  return tables.reduce((acc, table, idx) => {
    acc[table] = `t${idx}`;
    return acc;
  }, {} as Record<string, string>);
}

export function getAllTableColumns(tables: TableInfo[], selectedTables: string[]) {
  return selectedTables
    .map((tableName) => {
      const meta = tables.find((tab) => tab.table_name === tableName);
      return meta
        ? meta.columns.map((col) => ({ table: tableName, column: col.name }))
        : [];
    })
    .flat();
}

export function formatSql(sql: string): string {
  try {
    return sqlFormatter(sql, { language: "sql", keywordCase: "upper" });
  } catch {
    return sql; // fallback if formatting fails
  }
}

export function generateSql(queryState: QueryState): string {
  const {
    table: selectedTable,
    columns: selectedColumns,
    joins,
    filters,
    orderBy,
    limit,
  } = queryState;

  if (!selectedTable || selectedColumns.length === 0) return "";

  // Generate table aliases
  const tableAliases = generateTableAliases([
    selectedTable,
    ...joins.map((j) => j.table),
  ]);

  // Build SELECT clause with aliases for clarity
  const selectClauses = selectedColumns.map(
    (col) => `${tableAliases[col.table]}.${col.column} AS ${col.table}_${col.column}`
  );

  // Build FROM clause
  const fromClause = `${selectedTable} ${tableAliases[selectedTable]}`;

  // Build JOIN clauses
  const joinClauses = joins.map(
    (join) =>
      `LEFT JOIN ${join.table} ${tableAliases[join.table]} ON ${
        tableAliases[selectedTable]
      }.${join.baseColumn} = ${tableAliases[join.table]}.${join.column}`
  );

  // Build WHERE clause
  const whereClauses = filters.map((filter) => {
    const value =
      filter.op.toUpperCase() === "ILIKE"
        ? `'%${filter.value}%'`
        : isNaN(Number(filter.value))
        ? `'${filter.value}'`
        : filter.value;
    return `${tableAliases[filter.table]}.${filter.column} ${filter.op} ${value}`;
  });

  // Build ORDER BY clause
  const orderByClauses = orderBy.map(
    (order) =>
      `${tableAliases[order.table]}.${order.column} ${order.direction}`
  );

  // Construct the full query
  let query = `SELECT ${selectClauses.join(", ")}
FROM ${fromClause}
${joinClauses.length ? joinClauses.join("\n") : ""}`;

  if (whereClauses.length) {
    query += `\nWHERE ${whereClauses.join(" AND ")}`;
  }

  if (orderByClauses.length) {
    query += `\nORDER BY ${orderByClauses.join(", ")}`;
  }

  if (limit) {
    query += `\nLIMIT ${limit}`;
  }

  return formatSql(query);
}

export function parseSql(sql: string): QueryState {
  // Default state
  const state: QueryState = {
    table: "",
    columns: [],
    joins: [],
    limit: 100,
    filters: [],
    orderBy: [],
  };

  // Early return if no SQL
  if (!sql.trim()) return state;

  try {
    // Table and aliases
    const fromMatch = sql.match(/FROM\s+(\w+)\s+(t\d+)/i);
    if (!fromMatch) return state;

    state.table = fromMatch[1];
    const baseTableAlias = fromMatch[2];

    // Build alias mapping
    const tableAliases: Record<string, string> = {
      [state.table]: baseTableAlias
    };

    // Parse JOINs
    const joinRegex = /LEFT JOIN (\w+) (t\d+) ON (t\d+)\.(\w+) = (t\d+)\.(\w+)/g;
    const joins: Join[] = [];
    let joinMatch;
    while ((joinMatch = joinRegex.exec(sql))) {
      const [, table, alias, , baseColumn, , column] = joinMatch;
      tableAliases[table] = alias;
      joins.push({
        type: "LEFT",
        table,
        baseColumn,
        column,
      });
    }
    state.joins = joins;

    // Parse SELECT columns
    const selectMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    if (selectMatch) {
      const colsStr = selectMatch[1].trim();
      if (colsStr !== "*") {
        const colParts = colsStr.split(/,\s*/);
        state.columns = colParts.map((part) => {
          // Match pattern: t0.col AS table_col
          const colMatch = part.match(/(t\d+)\.(\w+)\s+AS\s+(\w+)_(\w+)/i);
          if (colMatch) {
            const [, alias, column] = colMatch;
            const table = Object.entries(tableAliases).find(([, a]) => a === alias)?.[0] || state.table;
            return { table, column };
          }
          return { table: state.table, column: part.trim() };
        });
      }
    }

    // Parse WHERE conditions
    const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:ORDER BY|LIMIT|$)/i);
    if (whereMatch) {
      const filtersStr = whereMatch[1].trim();
      const filterParts = filtersStr.split(/\s+AND\s+/i);
      state.filters = filterParts.map((part) => {
        const filterMatch = part.match(/(t\d+)\.(\w+)\s+(=|!=|<|>|<=|>=|ILIKE|LIKE)\s+'(.*?)'/i);
        if (filterMatch) {
          const [, alias, column, op, value] = filterMatch;
          const table = Object.entries(tableAliases).find(([, a]) => a === alias)?.[0] || state.table;
          return { table, column, op, value };
        }
        return { table: state.table, column: "", op: "=", value: "" };
      });
    }

    // Parse ORDER BY
    const orderByMatch = sql.match(/ORDER BY\s+([\s\S]+?)(?:LIMIT|$)/i);
    if (orderByMatch) {
      const orderByStr = orderByMatch[1].trim();
      const orderParts = orderByStr.split(/,\s*/);
      state.orderBy = orderParts.map((part) => {
        const orderMatch = part.match(/(t\d+)\.(\w+)\s+(ASC|DESC)/i);
        if (orderMatch) {
          const [, alias, column, direction] = orderMatch;
          const table = Object.entries(tableAliases).find(([, a]) => a === alias)?.[0] || state.table;
          return { table, column, direction: direction as "ASC" | "DESC" };
        }
        return { table: state.table, column: part.trim(), direction: "ASC" as const };
      });
    }

    // Parse LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      state.limit = Number(limitMatch[1]);
    }

    return state;
  } catch (error) {
    console.error("Error parsing SQL:", error);
    return state;
  }
}

export function getSqlContext(text: string): string | null {
  // Remove comments and excessive whitespace
  const cleaned = text.replace(/--.*$/gm, "").replace(/\s+/g, " ");
  // Find the last keyword before the cursor
  const keywords = [
    "select",
    "from",
    "join",
    "where",
    "on",
    "and",
    "or",
    "into",
    "update",
    "insert",
    "set",
    "group by",
    "order by",
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
  if (
    ["select", "where", "on", "and", "or", "set", "group by", "order by"].includes(
      lastKw
    )
  )
    return "column";
  return null;
} 