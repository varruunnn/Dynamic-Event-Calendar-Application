import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
    <div className="flex gap-2">
      <Button onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default CalendarHeader;
