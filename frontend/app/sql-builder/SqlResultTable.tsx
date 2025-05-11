import React from "react";
import { MantineReactTable, MRT_ColumnDef } from 'mantine-react-table';
import { MantineProvider } from '@mantine/core';

interface SqlResultTableProps {
  columns: string[];
  rows: any[];
}

const customBlue: [string, string, string, string, string, string, string, string, string, string] = [
  "#e3f2fd", // 0
  "#bbdefb", // 1
  "#90caf9", // 2
  "#64b5f6", // 3
  "#42a5f5", // 4
  "#2196f3", // 5
  "#1e88e5", // 6
  "#1976d2", // 7
  "#1565c0", // 8
  "#0d47a1", // 9
];

export default function SqlResultTable({ columns, rows }: SqlResultTableProps) {
  // Build Mantine column definitions
  const mantineColumns: MRT_ColumnDef<any>[] = columns.map(col => ({
    accessorKey: col,
    header: col,
    size: 180,
    enableColumnFilter: true,
    enableSorting: true,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-12 px-4">
      <MantineProvider
        theme={{
          primaryColor: 'blue',
          primaryShade: 8,
          colors: {
            blue: customBlue,
          },
        }}
      >
        <MantineReactTable
          columns={mantineColumns}
          data={rows}
          enableStickyHeader
          enableColumnResizing
          enablePagination
          mantineTableProps={{
            striped: true,
            highlightOnHover: true,
            withColumnBorders: false,
            style: {
              minHeight: 300,
              borderRadius: 16,
            },
          }}
          mantinePaperProps={{ radius: 'xl', shadow: 'none', p: 0, style: { overflow: 'hidden', border: 'none' } }}
          initialState={{ pagination: { pageSize: 25, pageIndex: 0 } }}
          positionPagination="bottom"
          enableFullScreenToggle
          enableDensityToggle
          enableColumnActions
          enableHiding
          enableGlobalFilter
          enableColumnFilters
          enableSorting
          enableRowNumbers
          enableTableHead
          enableTableFooter={false}
          enableRowSelection={false}
          enableRowActions={false}
          enableTopToolbar={true}
          enableBottomToolbar={true}
          enableColumnDragging={false}
          enableColumnOrdering
          enableColumnPinning
          mantineTableContainerProps={{ style: { maxHeight: 500, overflowX: 'auto', borderRadius: 16 } }}
        />
      </MantineProvider>
    </div>
  );
} 