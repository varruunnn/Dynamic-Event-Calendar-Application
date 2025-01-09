import React from 'react';
import { format, isToday, isSameDay, isSameMonth } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { categoryConfig } from './EventModal';

const CalendarDay = ({ 
  day, 
  currentDate, 
  selectedDate, 
  onDateClick, 
  events 
}) => {
  const dateStr = format(day, 'yyyy-MM-dd');
  
  return (
    <div
      className={`min-h-24 p-2 border ${
        isToday(day) ? 'bg-blue-50' : ''
      } ${
        !isSameMonth(day, currentDate) ? 'text-gray-400' : ''
      } ${
        isSameDay(day, selectedDate) ? 'border-blue-500' : ''
      }`}
      onClick={() => onDateClick(day)}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium">{format(day, 'd')}</span>
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            onDateClick(day);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-1">
        {events.map(event => (
          <div 
            key={event.id} 
            className={`text-xs p-1 mb-1 rounded truncate ${
              categoryConfig[event.category || 'others'].class
            }`}
          >
            {event.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;