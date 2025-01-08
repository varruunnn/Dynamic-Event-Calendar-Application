import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-all"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <FiSun className="text-yellow-400" size={24} />
      ) : (
        <FiMoon className="text-gray-800 dark:text-gray-200" size={24} />
      )}
    </button>
  );
};

export default ThemeToggle;
