/**
 * File: HomePage.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: December 23, 2024
 * Description: The private route component for the showcase site.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js"; // Import the helper function
import PropTypes from 'prop-types';

PrivateRoute.propTypes = {
    children: PropTypes.object.isRequired
};

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />; // Redirect if not logged in
};

export default PrivateRoute;