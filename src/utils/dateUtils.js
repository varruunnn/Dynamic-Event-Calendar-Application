import { parseISO, isBefore, isAfter, isEqual } from "date-fns";

// Checks if the new event overlaps with any existing events
export const isOverlapping = (newEvent, existingEvents) => {
  const { start: newStart, end: newEnd } = newEvent;

  // Parse start and end times of the new event
  const newStartTime = parseISO(newStart); // Assuming newStart is in ISO format (YYYY-MM-DDTHH:MM:SS)
  const newEndTime = parseISO(newEnd);

  return existingEvents.some((event) => {
    const { start, end } = event;

    // Parse start and end times of existing events
    const existingStartTime = parseISO(start); // Assuming start is in ISO format
    const existingEndTime = parseISO(end);

    // Check if the new event overlaps with any existing event
    return (
      (isBefore(newStartTime, existingEndTime) && isAfter(newEndTime, existingStartTime)) || 
      isEqual(newStartTime, existingStartTime) && isEqual(newEndTime, existingEndTime)
    );
  });
};

// Utility function to format a Date object to a 'YYYY-MM-DD' string
export const formatDate = (date) => date.toISOString().split("T")[0];
