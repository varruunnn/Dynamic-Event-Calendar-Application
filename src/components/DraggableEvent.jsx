import React from 'react';
import { useDrag } from 'react-dnd';
import { categoryConfig } from './EventModal';

const DraggableEvent = ({ event }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: { ...event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`text-xs p-1 mb-1 rounded truncate cursor-move ${
        categoryConfig[event.category || 'others'].class
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      {event.name}
    </div>
  );
};

export default DraggableEvent;