import { useState } from "react";

const categoryColors = {
  work: "bg-blue-600 dark:bg-blue-700", // A stronger blue for dark mode
  personal: "bg-green-600 dark:bg-green-700", // A stronger green for dark mode
  others: "bg-yellow-500 dark:bg-yellow-600", // Yellow for dark mode
};

const EventListPanel = ({ events, onEdit, onDelete }) => {
  const [searchKeyword, setSearchKeyword] = useState(""); // State for search keyword

  // Filter events based on search keyword (search by name or description)
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      event.description.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (filteredEvents.length === 0)
    return <p className="text-center text-gray-500 dark:text-gray-400">No events found.</p>;

  return (
    <div className="event-list space-y-4 w-48">
      {/* Search Bar */}
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Display filtered events */}
      {filteredEvents.map((event, index) => {
        // Get the category for the event and default to "others" if not set
        const categoryClass = categoryColors[event.category] || categoryColors.others;

        return (
          <div
            key={index}
            className={`event ${categoryClass} dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700`}
          >
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{event.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{event.start} - {event.end}</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{event.description}</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => onEdit(event)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(event)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventListPanel;
