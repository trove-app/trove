import React from "react";
import { MRT_ColumnDef } from 'mantine-react-table';
import { Table } from "../components/ui";
import { cn, layoutPatterns } from "../components/ui/utils";

interface SqlResultTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
}

export default function SqlResultTable({ columns, rows }: SqlResultTableProps) {
  // Build Mantine column definitions
  const mantineColumns: MRT_ColumnDef<Record<string, unknown>>[] = columns.map(col => ({
    accessorKey: col,
    header: col,
    size: 180,
    enableColumnFilter: true,
    enableSorting: true,
  }));

  return (
    <div className={cn(layoutPatterns.spacing.lg, "my-12 w-full")}>
      <Table
        columns={mantineColumns}
        data={rows}
        title="Query Results"
        subtitle={`${rows.length} rows`}
        enableStickyHeader
        enableColumnResizing
        enablePagination
        enableFullScreenToggle
        enableColumnActions
        enableHiding
        enableGlobalFilter
        enableColumnFilters
        enableSorting
        enableRowNumbers
        enableTableHead
        enableColumnOrdering
        enableColumnPinning
        maxHeight={500}
        pageSize={25}
      />
    </div>
  );
} 