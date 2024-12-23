/**
 * File: App.js
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The main app file
 *
 * Props:
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import './App.scss';
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Footer from "./components/Footer";

function App() {
  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      <Footer />
      </Router>
    );
  }
export default App;
