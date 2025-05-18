/**
 * File: LoginPage.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: December 23, 2024
 * Description: The login page for the showcase site.
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

// TODO: add basic client-side validation for email/password inputs to improve UX.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate(); // For redirecting after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData);
      const token = response.data.token;
      console.log("Login successful:", token);

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Redirect to dashboard
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="flex justify-center items-center sm:h-screen bg-gray-100 dark:bg-gray-900 mt-20 sm:mt-0">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">
          Login
        </h2>
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
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      </form>
    </div>
  );
};

export default LoginPage;