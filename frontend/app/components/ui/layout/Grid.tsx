import React from 'react';
import { cn } from '../utils/cn';
import { BaseComponentProps } from '../types';

export interface GridProps extends BaseComponentProps {
  /** Number of columns at different breakpoints */
  cols?: {
    base?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  /** Gap between grid items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to flow items by row or column */
  flow?: 'row' | 'col';
  /** Whether to auto-fit columns instead of using fixed counts */
  autoFit?: boolean;
  /** Minimum width for auto-fit columns */
  minColWidth?: string;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const;

const flowClasses = {
  row: 'grid-flow-row',
  col: 'grid-flow-col',
} as const;

/**
 * Grid component for responsive grid layouts
 * 
 * @example
 * <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    children,
    className,
    cols = { base: 1, md: 2, lg: 3 },
    gap = 'md',
    flow = 'row',
    autoFit = false,
    minColWidth = '200px',
    ...props 
  }, ref) => {
    // Build responsive column classes
    const colClasses = !autoFit ? cn(
      cols.base && `grid-cols-${cols.base}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`
    ) : `grid-cols-[repeat(auto-fit,minmax(${minColWidth},1fr))]`;

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colClasses,
          gapClasses[gap],
          flowClasses[flow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface GridItemProps extends BaseComponentProps {
  /** Number of columns this item should span */
  colSpan?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Number of rows this item should span */
  rowSpan?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * GridItem component for controlling individual grid items
 * 
 * @example
 * <Grid>
 *   <GridItem colSpan={{ base: 1, md: 2 }}>
 *     <Card />
 *   </GridItem>
 * </Grid>
 */
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    children,
    className,
    colSpan,
    rowSpan,
    ...props 
  }, ref) => {
    // Build responsive span classes
    const spanClasses = cn(
      // Column spans
      colSpan?.base && `col-span-${colSpan.base}`,
      colSpan?.sm && `sm:col-span-${colSpan.sm}`,
      colSpan?.md && `md:col-span-${colSpan.md}`,
      colSpan?.lg && `lg:col-span-${colSpan.lg}`,
      colSpan?.xl && `xl:col-span-${colSpan.xl}`,
      
      // Row spans
      rowSpan?.base && `row-span-${rowSpan.base}`,
      rowSpan?.sm && `sm:row-span-${rowSpan.sm}`,
      rowSpan?.md && `md:row-span-${rowSpan.md}`,
      rowSpan?.lg && `lg:row-span-${rowSpan.lg}`,
      rowSpan?.xl && `xl:row-span-${rowSpan.xl}`
    );

    return (
      <div
        ref={ref}
        className={cn(spanClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
); 