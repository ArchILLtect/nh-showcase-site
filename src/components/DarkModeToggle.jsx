import React, { useEffect } from 'react';

const DarkModeToggle = () => {
  // Load the saved dark mode state from localStorage on component mount
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      document.documentElement.classList.add('dark');
    }
  }, []); // Runs once when the component mounts

  // Toggle the dark mode state
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark'); // Toggles the "dark" class
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled'); // Saves the state
  };

  return (
    <button
      onClick={toggleDarkMode} // Click handler toggles dark mode
      className="px-4 py-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeToggle;