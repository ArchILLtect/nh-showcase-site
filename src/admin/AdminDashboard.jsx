/**
 * File: Dashboard.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: May 25, 2025
 * Description: This component renders the admin dashboard for the application.
 * It includes options for user tracking, admin tracking, and adding blogs.
 * It uses the Toolbar component to provide navigation options.
 * The dashboard is only accessible to users with admin or higher roles.
 * It also handles redirection for unauthorized users.
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

import React, { useState } from "react";
import { getLoggedInUser } from '../utils/auth';
import { Navigate } from "react-router-dom";
import { roleHierarchy } from "../constants/roles.js";
import Toolbar from "../components/ToolBar.jsx";
import BlogManager from "./BlogManager.jsx";
import VisitLogsDashboard from "../components/VisitLogsDashboard.jsx";
import AllVisitLogsDashboard from "./AllVisitLogsDashboard.jsx";


const AdminDashboard = () => {

  const [showAddBlog, setShowAddBlog] = useState(false);
  const [showUserTracking, setShowUserTracking] = useState(false);
  const [showAdminTracking, setShowAdminTracking] = useState(false);

  const handleUserTrackingClick = () => {
    setShowUserTracking(true);
    setShowAdminTracking(false);
    setShowAddBlog(false);
  }

  const handleAdminTrackingClick = () => {
    setShowUserTracking(false);
    setShowAdminTracking(true);
    setShowAddBlog(false);
  }

  const handleAddBlogClick = () => {
    setShowUserTracking(false);
    setShowAdminTracking(false);
    setShowAddBlog(true);
  }

  const user = getLoggedInUser();
  const username = user.username;
  const role = user?.role || "guest"; // Default to "guest" if no role is found
  const userLevel = roleHierarchy[role] || 0; // Default to 0 if role is not found
  const ipInfo = user?.knownIps || [];

  if (!user) return <Navigate to="/login" replace />; // Redirect to login if user is not logged in
  if (userLevel <= 1) return <Navigate to="/dashboard" replace />; // Redirect to login if user is not an admin

  return (
    <div>
      <h1 className="text-gray-600 dark:text-gray-300 text-4xl font-bold text-center mb-6">Admin Dashboard</h1>

      <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-300 mb-6">
        Welcome {username}, you have {role} access
      </h2>

      <div className="flex justify-center">
        <Toolbar
          actions={[
            { label: "User Tracking", onClick: handleUserTrackingClick, minLevel: roleHierarchy.admin },
            { label: "All Tracking", onClick: handleAdminTrackingClick, minLevel: roleHierarchy.admin },
            { label: "Add Blog", onClick: handleAddBlogClick, minLevel: roleHierarchy.admin },
          ]}
        />
      </div>
      
      {showUserTracking ? (
        <VisitLogsDashboard ipInfo={ipInfo} />
      ) : showAdminTracking ? (
        <AllVisitLogsDashboard />
      ) : showAddBlog ? (
        <BlogManager />
      ) : (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Select an action from the toolbar above.
          </p>
        </div>
      )
    }
    </div>
  )
};

export default AdminDashboard;