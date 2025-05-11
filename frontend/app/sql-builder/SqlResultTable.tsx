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
      <div className="w-full bg-white/70 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-md" style={{ boxShadow: 'none' }}>
        <MantineProvider
          theme={{
            primaryColor: 'blue',
            primaryShade: 8,
            colors: {
              blue: customBlue,
            },
            colorScheme: 'dark',
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
                borderRadius: 6,
                boxShadow: 'none',
                fontSize: '0.97rem',
                background: '#181C23',
                color: '#F1F5F9',
              },
            }}
            mantinePaperProps={{ radius: 'md', shadow: 'none', p: 0, style: { overflow: 'hidden', border: 'none', background: 'transparent' } }}
            initialState={{ pagination: { pageSize: 25, pageIndex: 0 }, density: 'xs' }}
            positionPagination="bottom"
            enableFullScreenToggle
            enableDensityToggle={false}
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
            mantineTableContainerProps={{ style: { maxHeight: 500, overflowX: 'auto', borderRadius: 6, background: 'transparent' } }}
            mantineTableBodyRowProps={() => ({ style: { height: 32, transition: 'background 0.2s', cursor: 'pointer', fontSize: '0.96rem' } })}
            mantineTableBodyProps={{
              sx: (theme) => ({
                '& tr:nth-of-type(odd)': {
                  backgroundColor: 'rgba(30, 80, 180, 0.10)',
                },
                '& tr:nth-of-type(even)': {
                  backgroundColor: '#181C23',
                },
                '& td, & th': {
                  color: '#F1F5F9',
                },
              }),
            }}
          />
        </MantineProvider>
      </div>
    </div>
  );
} 