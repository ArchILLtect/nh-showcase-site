/**
 * File: DarkModeToggle.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: December 23, 2024
 * Description: This is the component for toggling dark mode
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */


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
      className="px-4 py-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeToggle;