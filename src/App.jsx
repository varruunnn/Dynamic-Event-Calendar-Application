import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import Event from "./components/Event";
import EventListPanel from "./components/EventListPanel";
import { formatDate, isOverlapping } from "./utils/dateUtils";
import ThemeToggle from "./components/ThemeToggle";

const App = () => {
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleAddEditEvent = (event) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e === editingEvent ? { ...editingEvent, ...event } : e))
      );
    } else {
      if (isOverlapping(event, events)) {
        alert("Events cannot overlap!");
        return;
      }
      setEvents((prev) => [...prev, { ...event, date: formatDate(selectedDate) }]);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event) => {
    setEvents((prev) => prev.filter((e) => e !== event));
  };

  const dailyEvents = events.filter(
    (event) => event.date === formatDate(selectedDate)
  );

  return (
    <div
      className={`app min-h-screen flex flex-col items-center p-8 transition-all ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold dark:text-white">Event Calendar</h1>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>

        <Grid
          month={month}
          setMonth={setMonth}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <EventListPanel
          events={dailyEvents}
          onEdit={(event) => {
            setEditingEvent(event);
            setModalOpen(true);
          }}
          onDelete={handleDeleteEvent}
        />
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all mb-6"
      >
        Add Event
      </button>

      <Event
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleAddEditEvent}
        selectedDate={selectedDate}
        existingEvent={editingEvent}
      />
    </div>
  );
};

export default App;

