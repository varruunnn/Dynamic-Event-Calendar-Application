import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const categoryConfig = {
  work: {
    label: "Work",
    class: "bg-blue-100 border-l-4 border-blue-500",
    selectClass: "text-blue-500",
  },
  personal: {
    label: "Personal",
    class: "bg-green-100 border-l-4 border-green-500",
    selectClass: "text-green-500",
  },
  others: {
    label: "Others",
    class: "bg-yellow-100 border-l-4 border-yellow-500",
    selectClass: "text-yellow-500",
  },
};

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if two time ranges overlap
const isOverlapping = (start1, end1, start2, end2) => {
  const start1Mins = timeToMinutes(start1);
  const end1Mins = timeToMinutes(end1);
  const start2Mins = timeToMinutes(start2);
  const end2Mins = timeToMinutes(end2);
  
  return start1Mins < end2Mins && end1Mins > start2Mins;
};

const DraggableEventItem = ({ event, index, moveEvent, onDeleteEvent }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT_REORDER',
    item: { id: event.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'EVENT_REORDER',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveEvent(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-2 mb-2 rounded transition-opacity ${
        categoryConfig[event.category || 'others'].class
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center flex-1">
        <GripVertical className="h-4 w-4 mr-2 cursor-move text-gray-500" />
        <div>
          <div className="font-medium">{event.name}</div>
          <div className="text-sm text-gray-600">
            {event.startTime} - {event.endTime}
            <span className="ml-2 text-xs">
              ({categoryConfig[event.category || 'others'].label})
            </span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteEvent(event.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
};

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  eventForm,
  onFormChange,
  onSubmit,
  events,
  onDeleteEvent,
  onReorderEvents,
}) => {
  const [validationError, setValidationError] = React.useState('');

  const moveEvent = (dragIndex, hoverIndex) => {
    const reorderedEvents = [...events];
    const draggedEvent = reorderedEvents[dragIndex];
    reorderedEvents.splice(dragIndex, 1);
    reorderedEvents.splice(hoverIndex, 0, draggedEvent);
    onReorderEvents(reorderedEvents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if end time is after start time
    if (timeToMinutes(eventForm.endTime) <= timeToMinutes(eventForm.startTime)) {
      setValidationError('End time must be after start time');
      return;
    }

    // Check for overlaps with existing events
    const hasOverlap = events.some(existingEvent => 
      isOverlapping(
        eventForm.startTime,
        eventForm.endTime,
        existingEvent.startTime,
        existingEvent.endTime
      )
    );

    if (hasOverlap) {
      setValidationError('This event overlaps with an existing event');
      return;
    }

    setValidationError('');
    onSubmit(e);
  };

  // Clear validation error when form changes
  React.useEffect(() => {
    setValidationError('');
  }, [eventForm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white pb-4 z-10">
          <DialogTitle>{selectedDate}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={eventForm.name}
              onChange={(e) => onFormChange({ ...eventForm, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={eventForm.category || 'others'}
              onValueChange={(value) => onFormChange({ ...eventForm, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryConfig).map(([value, config]) => (
                  <SelectItem 
                    key={value} 
                    value={value}
                    className={config.selectClass}
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={eventForm.startTime}
                onChange={(e) => onFormChange({ ...eventForm, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={eventForm.endTime}
                onChange={(e) => onFormChange({ ...eventForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventForm.description}
              onChange={(e) => onFormChange({ ...eventForm, description: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Event
          </Button>
        </form>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Events for this day:</h3>
          <div className="space-y-1">
            {events.map((event, index) => (
              <DraggableEventItem
                key={event.id}
                event={event}
                index={index}
                moveEvent={moveEvent}
                onDeleteEvent={onDeleteEvent}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;