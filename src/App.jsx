import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, format } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CalendarHeader from './components/CalendarHeader';
import SearchBar from './components/SearchBar';
import CalendarDay from './components/CalendarDay';
import EventModal from './components/EventModal';

const ItemType = {
  EVENT: 'event',
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('calendarEvents')) || {});
  const [eventForm, setEventForm] = useState({ 
    name: '', 
    startTime: '', 
    endTime: '', 
    description: '',
    category: 'others'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setEvents({
      ...events,
      [dateStr]: [...(events[dateStr] || []), { id: Date.now(), ...eventForm }],
    });
    setEventForm({ name: '', startTime: '', endTime: '', description: '' });
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setEvents({
      ...events,
      [dateStr]: events[dateStr].filter(event => event.id !== eventId),
    });
  };

  // const handleEventDrop = (event, newDate) => {
  //   const dateStr = format(newDate, 'yyyy-MM-dd');
  //   setEvents((prevEvents) => {
  //     const updatedEvents = { ...prevEvents };
  //     const oldDateStr = format(new Date(event.date), 'yyyy-MM-dd');
  //     updatedEvents[oldDateStr] = updatedEvents[oldDateStr].filter(e => e.id !== event.id);
  //     updatedEvents[dateStr] = [...(updatedEvents[dateStr] || []), { ...event, date: dateStr }];
  //     return updatedEvents;
  //   });
  // };

  const filteredEvents = (dateStr) => {
    const dayEvents = events[dateStr] || [];
    return searchTerm
      ? dayEvents.filter(event =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : dayEvents;
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const handleReorderEvents = (reorderedEvents) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setEvents(prevEvents => ({
      ...prevEvents,
      [dateStr]: reorderedEvents,
    }));
  };
  // const drop = (event, targetDay) => {
  //   const sourceDateStr = format(new Date(event.date), 'yyyy-MM-dd');
  //   const targetDateStr = format(targetDay, 'yyyy-MM-dd');
  //   if (sourceDateStr === targetDateStr) return;
  //   const targetDayEvents = events[targetDateStr] || [];
  //   const hasTimeConflict = targetDayEvents.some(existingEvent => {
  //     const eventStart = new Date(`${targetDateStr}T${event.startTime}`);
  //     const eventEnd = new Date(`${targetDateStr}T${event.endTime}`);
  //     const existingStart = new Date(`${targetDateStr}T${existingEvent.startTime}`);
  //     const existingEnd = new Date(`${targetDateStr}T${existingEvent.endTime}`);

  //     return (
  //       (eventStart >= existingStart && eventStart < existingEnd) ||
  //       (eventEnd > existingStart && eventEnd <= existingEnd) ||
  //       (eventStart <= existingStart && eventEnd >= existingEnd)
  //     );
  //   });
  
  //   if (hasTimeConflict) {
  //     alert('Cannot move event due to time conflict with existing events');
  //     return;
  //   }
  //   setEvents(prevEvents => {
  //     const updatedEvents = { ...prevEvents };
  //     updatedEvents[sourceDateStr] = (updatedEvents[sourceDateStr] || [])
  //       .filter(e => e.id !== event.id);
  //     const updatedEvent = {
  //       ...event,
  //       date: targetDateStr,
  //     };
  //     updatedEvents[targetDateStr] = [
  //       ...(updatedEvents[targetDateStr] || []),
  //       updatedEvent,
  //     ];
  //     return updatedEvents;
  //   });
  // };
  
  const handleExport = (type) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthEvents = Object.keys(events)
      .filter((date) => {
        const eventDate = new Date(date);
        return eventDate >= monthStart && eventDate <= monthEnd;
      })
      .reduce((acc, date) => {
        acc[date] = events[date];
        return acc;
      }, {});
  
    if (type === 'json') {
      const jsonString = JSON.stringify(monthEvents, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `events-${format(currentDate, 'yyyy-MM')}.json`;
      link.click();
    } else if (type === 'csv') {
      const csvData = [];
      csvData.push(['Date', 'Event Name', 'Description', 'Category']);
  
      Object.entries(monthEvents).forEach(([date, dayEvents]) => {
        dayEvents.forEach((event) => {
          csvData.push([date, event.name, event.description, event.category]);
        });
      });
  
      const csvString = csvData
        .map((row) => row.map((item) => `"${item}"`).join(','))
        .join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `events-${format(currentDate, 'yyyy-MM')}.csv`;
      link.click();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto p-4">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <div className="flex justify-end my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleExport('json')}
          >
            Export as JSON
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => handleExport('csv')}
          >
            Export as CSV
          </button>
        </div>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-bold">{day}</div>
          ))}
          {calendarDays.map(day => (
            <CalendarDay
              key={day}
              day={day}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              events={filteredEvents(format(day, 'yyyy-MM-dd'))}
              // onEventDrop={drop}
            />
          ))}
        </div>
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={format(selectedDate, 'MMMM dd, yyyy')}
          eventForm={eventForm}
          onFormChange={setEventForm}
          onSubmit={handleAddEvent}
          events={filteredEvents(format(selectedDate, 'yyyy-MM-dd'))}
          onDeleteEvent={handleDeleteEvent}
          onReorderEvents={handleReorderEvents}
        />
      </div>
    </DndProvider>
  );
};

export default App;
