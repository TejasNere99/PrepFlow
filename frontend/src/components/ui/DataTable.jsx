import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

/**
 * Reusable DataTable component
 * @param {Array} columns - Array of column objects { key, label, className, render(row) }
 * @param {Array} data - Array of data objects
 * @param {boolean} isLoading - Loading state
 * @param {React.ReactNode} emptyState - Component to render when data is empty
 * @param {Array} selectedIds - Array of selected row IDs
 * @param {Function} onSelect - Function called with new array of selected IDs
 * @param {Function} onReorder - Function called when row is dropped, returns (sourceIndex, destinationIndex)
 */
export default function DataTable({ columns, data, isLoading, emptyState, selectedIds = [], onSelect, onReorder }) {
  const isAllSelected = data && data.length > 0 && selectedIds.length === data.length;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    if (onReorder) {
      onReorder(result.source.index, result.destination.index);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelect([]);
    } else {
      onSelect(data.map(row => row._id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

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
              {onReorder && <th className="px-3 py-3 w-8"></th>}
              {onSelect && (
                <th className="px-5 py-3 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-600/50 cursor-pointer"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={`px-5 py-3 ${col.headerClassName || col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {onReorder ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="datatable-droppable" direction="vertical">
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm"
                  >
                    {data.map((row, rowIndex) => (
                      <Draggable key={row._id || rowIndex} draggableId={row._id || String(rowIndex)} index={rowIndex}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={provided.draggableProps.style}
                            className={`transition-colors hover:bg-zinc-900/20 group ${selectedIds.includes(row._id) ? 'bg-purple-900/10' : ''} ${snapshot.isDragging ? 'bg-zinc-900 shadow-lg ring-1 ring-purple-500' : ''}`}
                          >
                            <td className="px-3 py-4 w-8 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400" {...provided.dragHandleProps}>
                              <GripVertical size={16} />
                            </td>
                            {onSelect && (
                              <td className="px-5 py-4 w-10">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-600/50 cursor-pointer"
                                  checked={selectedIds.includes(row._id)}
                                  onChange={() => handleSelectOne(row._id)}
                                />
                              </td>
                            )}
                            {columns.map((col, colIndex) => (
                              <td key={`${row._id || rowIndex}-${col.key || colIndex}`} className={`px-5 py-4 ${col.className || ''}`}>
                                {col.render ? col.render(row) : row[col.key]}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <tbody className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm">
              {data.map((row, rowIndex) => (
                <tr key={row._id || rowIndex} className={`transition-colors hover:bg-zinc-900/20 group ${selectedIds.includes(row._id) ? 'bg-purple-900/10' : ''}`}>
                  {onSelect && (
                    <td className="px-5 py-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-600/50 cursor-pointer"
                        checked={selectedIds.includes(row._id)}
                        onChange={() => handleSelectOne(row._id)}
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={`${row._id || rowIndex}-${col.key || colIndex}`} className={`px-5 py-4 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
