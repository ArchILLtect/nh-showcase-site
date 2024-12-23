import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js"; // Import the helper function

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />; // Redirect if not logged in
};

export default PrivateRoute;