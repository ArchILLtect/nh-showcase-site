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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.scss";
import HomePage from "./pages/HomePage";
import Projects from "./pages/Projects";
import AboutMe from "./pages/AboutMe";
import BlogPage from "./pages/Blog";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import BlogManager from "./admin/BlogManager";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/about" element={<AboutMe />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute requiredRole="user">
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    );
}
export default App;
