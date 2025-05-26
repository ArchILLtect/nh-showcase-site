/**
 * File: HomePage.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: May 22, 2024
 * Description: The private route component for the showcase site.
 *
 * Props:
 * - children: The child components to be rendered if the user has access.
 * - requiredRole: The role required to access the route (default is "user").
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 * - React Router DOM: A library for routing in React applications.
 * - PropTypes: A library for type checking React props.
 * - roleHierarchy: A constant that defines the role hierarchy for access control.
 * - isLoggedIn: A utility function to check if the user is logged in.
 * - getLoggedInUser: A utility function to get the logged-in user's information.
 * - Navigate: A component from React Router DOM for navigation.
 * 
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { roleHierarchy } from "../constants/roles";
import { isLoggedIn, getLoggedInUser } from "../utils/auth.js"; // Import the helper function
import PropTypes from 'prop-types';

export default function PrivateRoute({ children, requiredRole = "user" }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const user = getLoggedInUser();
  if (!user || !user.role) return <Navigate to="/login" replace />;

  const userLevel = roleHierarchy[user.role] ?? 0;
  const requiredLevel = roleHierarchy[requiredRole] ?? 0;

  if (userLevel < requiredLevel) {
    alert("You don't have the required access permissions to visit this page!"); 
    return <Navigate to="/" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};