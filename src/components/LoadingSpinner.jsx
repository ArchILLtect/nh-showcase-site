/**
 * File: LoadingSpinner.jsx
 * Author: Nick Hanson
 * Created On: July 17, 2024
 * Last Updated: July 17, 2025
 * Description: A modal component that displays a spinner during loading.
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
 * 
 */

import React from "react";

  const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-40 w-40 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  };

  export default LoadingSpinner;