/**
 * File: App.js
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: June 13, 2025
 * Description: The main app file
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 * - Implements React Router for navigation.
 * - Contains private routes for user and admin dashboards.
 * - Uses a custom PrivateRoute component to handle authentication and authorization.
 * - Layout component wraps all pages for consistent header and footer.
 * - Includes pages for Home, Projects, About Me, Blog, Contact, Login, Register, User Dashboard, and Admin Dashboard.
 *
 *
 * Dependencies:
 * - React
 * - React Router DOM
 * - Custom components: PrivateRoute, Layout
 * - Custom styles: App.scss
 *
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.scss";
import HomePage from "./pages/HomePage";
import Projects from "./pages/Projects";
import AboutMe from "./pages/AboutMe";
import Experience from "./pages/Experience";
import BlogPage from "./pages/Blog";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import Certificates from "./pages/Certificates";
import VideoPage from "./pages/VideoPage";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/about" element={<AboutMe />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/video" element={<VideoPage />} />
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
