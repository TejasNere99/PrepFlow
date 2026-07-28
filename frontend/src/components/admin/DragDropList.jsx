import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function DragDropList({ items, onReorder, renderItem }) {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(localItems);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setLocalItems(reordered);

    // Call the parent to update backend
    // The items will now have a new displayOrder based on index
    const updates = reordered.map((item, index) => ({
      id: item._id,
      displayOrder: index
    }));
    onReorder(updates);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
            {localItems.map((item, index) => (
              <Draggable key={item._id} draggableId={item._id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center gap-3 bg-zinc-900 border ${snapshot.isDragging ? 'border-purple-500 shadow-lg' : 'border-zinc-800'} rounded-lg p-3 transition-colors`}
                  >
                    <div {...provided.dragHandleProps} className="text-zinc-500 hover:text-zinc-300">
                      <GripVertical size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {renderItem(item)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
