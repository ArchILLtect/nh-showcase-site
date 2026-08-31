/**
 * File: LoginPage.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: July 25, 2025
 * Description: The login page for the showcase site.
 * This is where the user can log in to their account.
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
 * - useState: A React hook for managing state.
 * - useEffect: A React hook for side effects.
 * - useRef: A React hook for referencing DOM elements.
 * - React Router: For navigation and routing.
 * - useNavigate: A React Router hook for navigation.
 * - Link: A React Router component for navigation links.
 * - axios: A promise-based HTTP client for making API requests.
 * - trackVisit: A utility function for tracking visits.
 * - login: A utility function for handling login logic.
 * - roleHierarchy: A constant for user role hierarchy.
 * - LoadingSpinner: A component for displaying a spinner during loading times.
 */

// TODO: Replace browser alerts with an accessible in-page notification.

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { trackVisit } from "../utils/visitTracker";
import { login } from "../utils/auth";
import { roleHierarchy } from "../constants/roles";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePageTitle } from '../hooks/usePageTitle';

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const LoginPage = () => {
  usePageTitle('Login');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate(); // For redirecting after login

  useEffect(() => {
      trackVisit();
    }, []);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const attemptLogin = async (ip) => {

    const response = await axios.post(`${API_BASE_URL}/login`, {
      ...formData,
      ip
    });

    const { token, user } = response.data;

    login(token, user);
    alert("Login successful!");

    const userLevel = user?.role ? roleHierarchy[user.role] ?? 0 : 0;

    if (userLevel >= roleHierarchy.admin ) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const start = Date.now();

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipResponse.json();

    try {
      setLoading(true); // start loading
      await attemptLogin(ip);
    } catch (error) {
      const isServerError = error.response?.status === 500;

      if (isServerError) {
        alert("Temporary server issue. Retrying login...");
        setTimeout(async () => {
          try {
            await attemptLogin(ip);
          } catch (retryErr) {
            alert("Retry failed. Please try again later.");
            console.error("Retry login failed:", retryErr);
          } finally {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 500 - elapsed);
            setTimeout(() => setLoading(false), remaining);
          }
        }, 1000);
      } else {
        alert(error.response?.data?.message || "Error logging in");
        console.error("Login failed:", error);
      }
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center sm:h-screen bg-gray-100 dark:bg-gray-900
        mt-20 sm:mt-0">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-gray-100">
          Login
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                type="username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="password"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                required
              />
              <input
                type="checkbox"
                id="show_password_check"
                checked={showPassword}
                onChange={togglePassword}
              />
              <label htmlFor="show_password_check" className="w-full px-4 py-2 text-gray-700 dark:text-gray-100">
                {showPassword ? "Hide Password" : "Show Password"}
              </label>
            </div>
          </>
        )}
            <button
              type="submit"
              disabled={loading}
              aria-label="Login"
              className={`w-full mt-4 px-4 py-2 rounded ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              } text-white font-semibold transition-colors duration-200 dark:text-gray-100`}
            >
              Login
            </button>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                Register here
              </Link>
            </p>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
              Forgot your password?{" "}
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                Reset it here
              </Link>
            </p>
      </form>
    </div>
  );
};

export default LoginPage;