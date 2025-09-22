/**
 * File: Privacy.jsx
 * Author: Nick Hanson
 * Created On: September 22, 2025
 * Last Updated: September 22, 2025
 * Description: Privacy & Cookies page describing localStorage and analytics usage.
 */

import React, { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy & Cookies - Nick Hanson Showcase";
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-3xl mx-auto p-6 mb-20 rounded">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Privacy & Cookies</h1>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        We use local storage and cookies to improve your experience. This includes remembering your
        authentication state, dark mode preferences, and measuring basic visit activity.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-2">What we store</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-1">
        <li><strong>authToken</strong> and <strong>userData</strong> in localStorage to keep you logged in.</li>
        <li>Optional analytics: anonymized IP and user-agent via a serverless endpoint to count visits.</li>
        <li>UI preferences (e.g., dark mode) may be stored to persist your settings.</li>
      </ul>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-2">Your choices</h2>
      <p className="text-gray-700 dark:text-gray-200 mb-2">
        You can accept or decline non-essential storage via the banner. Essential items needed for
        site functionality (e.g., authentication) may still be set after you sign in.
      </p>
      <p className="text-gray-700 dark:text-gray-200">
        You can clear stored data anytime from your browser settings.
      </p>
    </div>
  );
}
