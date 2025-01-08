import { format, startOfMonth, endOfMonth, endOfWeek, startOfWeek, addDays, subMonths, addMonths, isSameDay, isSameMonth } from "date-fns";

const Grid = ({ month, setMonth, events, setSelectedDate, selectedDate }) => {
  const startDate = startOfWeek(startOfMonth(month));
  const endDate = endOfWeek(endOfMonth(month));
  const days = [];

  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    days.push(day);
  }

  const handleDayClick = (day) => {
    if (!isSameMonth(day, month)) {
      setMonth(day);  
    }
    setSelectedDate(day); 
  };

  return (
    <div className="calendar-grid max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonth(subMonths(month, 1))}
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
        >
          Previous
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {format(month, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setMonth(addMonths(month, 1))}
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="text-center text-sm font-medium text-gray-500 dark:text-gray-300">
            {dayName}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className={`text-center p-2 cursor-pointer rounded-md transition-all 
              ${isSameDay(day, selectedDate) ? "bg-indigo-600 text-white dark:text-gray-100" : ""} 
              ${!isSameMonth(day, month) ? "text-gray-400" : "text-gray-800 dark:text-white"} 
              hover:bg-indigo-100 dark:hover:bg-indigo-600`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;