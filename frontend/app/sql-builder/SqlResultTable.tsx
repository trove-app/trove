import React from "react";
import { MantineReactTable, MRT_ColumnDef } from 'mantine-react-table';
import { MantineProvider } from '@mantine/core';
import { useTheme } from '../context/ThemeContext';

interface SqlResultTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
}

// Define Trove brand colors with proper typing
type ColorScale = [string, string, string, string, string, string, string, string, string, string];

const troveColors: { gold: ColorScale; brown: ColorScale } = {
  gold: ["#fefbf0", "#fef7e0", "#fdecc4", "#fbd788", "#f9c74f", "#F4B100", "#d89e00", "#b8850a", "#956910", "#7a5611"],
  brown: ["#fdf8f6", "#f2e8e5", "#eaddd7", "#e0cec7", "#d2bab0", "#A25D2D", "#b8704a", "#9c5a3c", "#824b32", "#6b3f2b"],
};

export default function SqlResultTable({ columns, rows }: SqlResultTableProps) {
  const { theme } = useTheme();

  // Build Mantine column definitions
  const mantineColumns: MRT_ColumnDef<Record<string, unknown>>[] = columns.map(col => ({
    accessorKey: col,
    header: col,
    size: 180,
    enableColumnFilter: true,
    enableSorting: true,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-12 px-4">
      <div className="w-full bg-card/80 border border-border rounded-xl shadow-treasure">
        <MantineProvider
          theme={{
            primaryColor: 'brown',
            primaryShade: 5,
            colors: {
              gold: troveColors.gold,
              brown: troveColors.brown,
            },
            colorScheme: theme,
            components: {
              Table: {
                styles: {
                  root: {
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.97rem',
                    borderRadius: 'var(--radius)',
                  },
                  tr: {
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'var(--color-muted)',
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: 'var(--color-card)',
                    },
                    '&:hover': {
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-accent-foreground)',
                    },
                  },
                  th: {
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontWeight: 600,
                    borderBottom: '1px solid var(--color-border)',
                  },
                  td: {
                    borderBottom: '1px solid var(--color-border)',
                  },
                },
              },
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
                borderRadius: 'var(--radius)',
                boxShadow: 'none',
              },
            }}
            mantinePaperProps={{
              radius: 'xl',
              shadow: 'none',
              p: 0,
              style: {
                overflow: 'hidden',
                border: 'none',
                background: 'transparent',
              },
            }}
            initialState={{
              pagination: { pageSize: 25, pageIndex: 0 },
              density: 'xs',
            }}
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
            mantineTableContainerProps={{
              style: {
                maxHeight: 500,
                overflowX: 'auto',
                borderRadius: 'var(--radius)',
                background: 'transparent',
              },
            }}
            mantineTableBodyRowProps={{
              style: {
                height: 32,
                transition: 'background 0.2s',
                cursor: 'pointer',
                fontSize: '0.96rem',
              },
            }}
          />
        </MantineProvider>
      </div>
    </div>
  );
} 