import { useState } from "react";

const Event = ({ isOpen, onClose, onSave, selectedDate, existingEvent }) => {
  const [name, setName] = useState(existingEvent?.name || "");
  const [start, setStart] = useState(existingEvent?.start || "");
  const [end, setEnd] = useState(existingEvent?.end || "");
  const [description, setDescription] = useState(existingEvent?.description || "");
  const [category, setCategory] = useState(existingEvent?.category || "work"); // Default category is "work"

  const handleSave = () => {
    // Create event object with category
    onSave({ name, start, end, description, category });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {existingEvent ? "Edit Event" : "Add Event"} for {selectedDate.toLocaleDateString()}
        </h3>
        
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
        />
        
        <div className="flex space-x-4 mb-4">
          <input
            type="time"
            placeholder="Start Time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
          />
          
          <input
            type="time"
            placeholder="End Time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
        />
        
        {/* Add Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm text-gray-800 dark:text-white mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="others">Others</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Event;
