import React from 'react';

/**
 * Reusable DataTable component
 * @param {Array} columns - Array of column objects { key, label, className, render(row) }
 * @param {Array} data - Array of data objects
 * @param {boolean} isLoading - Loading state
 * @param {React.ReactNode} emptyState - Component to render when data is empty
 */
export default function DataTable({ columns, data, isLoading, emptyState }) {
  if (isLoading) {
    return null; // The parent usually handles loading state, or we can put Skeleton here
  }

  if (!data || data.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-zinc-900/40 backdrop-blur-sm">
            <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 shadow-sm">
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={`px-5 py-3 ${col.headerClassName || col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm">
            {data.map((row, rowIndex) => (
              <tr key={row._id || rowIndex} className="transition-colors hover:bg-zinc-900/20 group">
                {columns.map((col, colIndex) => (
                  <td key={`${row._id || rowIndex}-${col.key || colIndex}`} className={`px-5 py-4 ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
