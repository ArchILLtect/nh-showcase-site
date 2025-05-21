/**
 * File: Dashboard.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The dashboard page for the showcase site. This is were the
 *              user lands after successful login.
 *
 * Props:
 * None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */


// TODO: Add a welcome message or additional UI elements to enhance the experience.

import React from "react";
import { getLoggedInUser } from '../utils/auth';
import { Navigate } from "react-router-dom";
import { roleHierarchy } from "../constants/roles.js";
import BlogManager from "./BlogManager.jsx";

const AdminDashboard = () => {
  const user = getLoggedInUser();
  const username = user.username;
  const role = user?.role || "guest"; // Default to "guest" if no role is found
  const userLevel = roleHierarchy[role] || 0; // Default to 0 if role is not found

  if (!user) return <Navigate to="/login" replace />; // Redirect to login if user is not logged in
  if (userLevel <= 1) return <Navigate to="/dashboard" replace />; // Redirect to login if user is not an admin

  return (
    <div>
      <h1 className="text-gray-600 dark:text-gray-300 text-4xl font-bold text-center mb-6">Admin Dashboard</h1>

      <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-300 mb-6">
        Welcome {username}, you have {role} access
      </h2>

      <BlogManager />

    </div>
  )
};

export default AdminDashboard;