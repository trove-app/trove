import React, { useState } from "react";

interface SqlResultTableProps {
  columns: string[];
  rows: any[];
}

const ROWS_PER_PAGE = 25;

export default function SqlResultTable({ columns, rows }: SqlResultTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
  const paginatedRows = rows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

  React.useEffect(() => {
    // Reset to first page if rows change
    setPage(0);
  }, [rows]);

  return (
    <div className="w-full max-w-5xl overflow-x-auto bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-slate-200 dark:border-zinc-800">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="px-3 py-2 border-b border-slate-300 dark:border-zinc-700 text-left font-bold bg-slate-100 dark:bg-zinc-800 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-4">No results</td></tr>
          ) : (
            paginatedRows.map((row, i) => (
              <tr key={i} className="even:bg-slate-50 dark:even:bg-zinc-800">
                {columns.map(col => (
                  <td key={col} className="px-3 py-2 border-b border-slate-200 dark:border-zinc-800 whitespace-nowrap">{row[col]?.toString() ?? ""}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="px-3 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-700 dark:text-zinc-200">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 