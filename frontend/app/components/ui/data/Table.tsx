'use client';

import React, { useEffect, useState } from 'react';
import { MantineReactTable, MRT_ColumnDef, MRT_DensityState } from 'mantine-react-table';
import { MantineProvider, useMantineTheme } from '@mantine/core';
import { Text, Card } from '../';
import { cn, layoutPatterns } from '../utils';

export interface TableProps<T extends Record<string, unknown>> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  enableStickyHeader?: boolean;
  enableColumnResizing?: boolean;
  enablePagination?: boolean;
  enableFullScreenToggle?: boolean;
  enableDensityToggle?: boolean;
  enableColumnActions?: boolean;
  enableHiding?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableSorting?: boolean;
  enableRowNumbers?: boolean;
  enableTableHead?: boolean;
  enableTableFooter?: boolean;
  enableRowSelection?: boolean;
  enableRowActions?: boolean;
  enableTopToolbar?: boolean;
  enableBottomToolbar?: boolean;
  enableColumnDragging?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  maxHeight?: number;
  pageSize?: number;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  subtitle,
  enableStickyHeader = true,
  enableColumnResizing = true,
  enablePagination = true,
  enableFullScreenToggle = true,
  enableDensityToggle = false,
  enableColumnActions = true,
  enableHiding = true,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enableSorting = true,
  enableRowNumbers = true,
  enableTableHead = true,
  enableTableFooter = false,
  enableRowSelection = false,
  enableRowActions = false,
  enableTopToolbar = true,
  enableBottomToolbar = true,
  enableColumnDragging = false,
  enableColumnOrdering = true,
  enableColumnPinning = true,
  maxHeight = 500,
  pageSize = 25,
  className,
}: TableProps<T>) {
  // State for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const globalTheme = useMantineTheme();

  // Update visible columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        const priorityColumns = columns.filter(col => 
          col.enableHiding !== false || 
          col.header?.toString().toLowerCase().includes('name') || 
          col.header?.toString().toLowerCase().includes('id')
        ).slice(0, 3);
        setVisibleColumns(priorityColumns);
      } else {
        setVisibleColumns(columns);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  // Update dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDarkMode(e.matches);
      setThemeKey(prev => prev + 1);
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={cn(layoutPatterns.spacing.lg, className)}>
      {(title || subtitle) && (
        <div className={cn(
          layoutPatterns.flexBetween,
          "mb-4 flex-col md:flex-row gap-2 md:gap-0"
        )}>
          {title && <Text weight="semibold" variant="primary">{title}</Text>}
          {subtitle && <Text size="xs" variant="muted">{subtitle}</Text>}
        </div>
      )}
      
      <Card variant="glass" padding="none" className="w-full overflow-hidden" size="full">
        <MantineProvider
          key={themeKey}
          theme={{
            ...globalTheme,
            colorScheme: isDarkMode ? 'dark' : 'light',
            colors: {
              // Use our brand colors
              primary: [
                isDarkMode ? '#472e05' : '#FFF7EC', // 0
                isDarkMode ? '#956910' : '#fef7e0', // 1
                isDarkMode ? '#b8850a' : '#fdecc4', // 2
                isDarkMode ? '#d89e00' : '#fbd788', // 3
                isDarkMode ? '#F4B100' : '#f9c74f', // 4
                '#F4B100',                          // 5 - Primary (Treasure Gold)
                isDarkMode ? '#f9c74f' : '#d89e00', // 6
                isDarkMode ? '#fbd788' : '#b8850a', // 7
                isDarkMode ? '#fdecc4' : '#956910', // 8
                isDarkMode ? '#fef7e0' : '#472e05', // 9
              ],
            },
            primaryColor: 'primary',
            primaryShade: isDarkMode ? 4 : 5,
            white: isDarkMode ? '#1A1A1A' : '#FFFFFF',
            black: isDarkMode ? '#FFF7EC' : '#2A2A2A',
          }}
        >
          <MantineReactTable
            columns={visibleColumns}
            data={data}
            enableStickyHeader={enableStickyHeader}
            enableColumnResizing={!isMobile && enableColumnResizing}
            enablePagination={enablePagination}
            mantineTableProps={{
              striped: true,
              highlightOnHover: true,
              withColumnBorders: false,
              style: {
                minHeight: 300,
                borderRadius: 6,
                boxShadow: 'none',
                fontSize: isMobile ? '0.875rem' : '0.97rem',
              },
            }}
            mantinePaperProps={{
              shadow: 'none',
              style: {
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                boxShadow: 'none',
              },
            }}
            mantineToolbarAlertBannerProps={{
              styles: {
                root: {
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF7EC',
                },
              },
            }}
            mantineTopToolbarProps={{
              style: {
                backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF7EC',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                padding: '16px',
              },
            }}
            mantineBottomToolbarProps={{
              style: {
                backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF7EC',
                borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                padding: '16px',
              },
            }}
            mantineSearchTextInputProps={{
              styles: {
                input: {
                  backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
            mantineFilterTextInputProps={{
              styles: {
                input: {
                  backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              },
            }}
            mantineEditSelectProps={{
              styles: {
                input: {
                  backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                dropdown: {
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                item: {
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(244, 177, 0, 0.15)' : 'rgba(244, 177, 0, 0.05)',
                  },
                },
              },
            }}
            initialState={{ 
              pagination: { 
                pageSize: isMobile ? 10 : pageSize, 
                pageIndex: 0 
              }, 
              density: 'spacious' as MRT_DensityState,
              columnVisibility: Object.fromEntries(
                columns.map(col => [
                  col.accessorKey || '',
                  visibleColumns.some(vc => vc.accessorKey === col.accessorKey)
                ])
              )
            }}
            enableTopToolbar={enableTopToolbar}
            enableBottomToolbar={enableBottomToolbar}
            enableColumnDragging={enableColumnDragging}
            enableColumnOrdering={enableColumnOrdering}
            enableColumnPinning={enableColumnPinning}
            enableColumnActions={enableColumnActions}
            enableHiding={enableHiding}
            enableGlobalFilter={enableGlobalFilter}
            enableColumnFilters={enableColumnFilters}
            enableSorting={enableSorting}
            enableRowNumbers={enableRowNumbers}
            enableTableHead={enableTableHead}
            enableTableFooter={enableTableFooter}
            enableRowSelection={enableRowSelection}
            enableRowActions={enableRowActions}
            enableFullScreenToggle={enableFullScreenToggle}
            enableDensityToggle={enableDensityToggle}
          />
        </MantineProvider>
      </Card>
    </div>
  );
} 