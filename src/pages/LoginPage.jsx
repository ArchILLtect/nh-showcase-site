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

// TODO: Change alert message to use a modal or toast notification for better UX.

// TODO: Implement server-side validation for login credentials to ensure security.
// TODO: Implement server-side rate limiting to prevent brute force attacks on login.
// TODO: Implement server-side logging for login attempts to monitor suspicious activity.
// TODO: Implement server-side password hashing and salting for secure storage.
// TODO: Implement server-side session management to handle user sessions securely.
// TODO: Implement server-side CSRF protection for login requests to prevent cross-site request forgery attacks.
// TODO: Implement server-side XSS protection to prevent cross-site scripting attacks.
// TODO: Implement server-side CORS policy to restrict access to the API from unauthorized origins.
// TODO: Implement server-side input sanitization to prevent injection attacks.
// TODO: Implement server-side error handling to provide meaningful error messages without exposing sensitive information.
// TODO: Implement server-side logging for errors to monitor and debug issues.
// TODO: Implement server-side security headers to enhance security (e.g., Content Security Policy, X-Content-Type-Options, etc.).
// TODO: Implement server-side HTTPS enforcement to ensure secure communication.
// TODO: Implement server-side password reset functionality to allow users to reset their passwords securely.
// TODO: Implement server-side email verification for new accounts to ensure valid email addresses.
// TODO: Implement server-side account lockout after multiple failed login attempts to prevent brute force attacks.
// TODO: Implement server-side multi-factor authentication (MFA) for enhanced security.
// TODO: Implement server-side session expiration to automatically log out users after a period of inactivity.
// TODO: Implement server-side user role management to control access to different parts of the application based on user roles.
// TODO: Implement server-side logging for user actions to monitor user activity and detect suspicious behavior.
// TODO: Implement server-side API rate limiting to prevent abuse of the login endpoint.
// TODO: Implement server-side password strength validation to ensure users create strong passwords.
// TODO: Implement server-side account deletion functionality to allow users to delete their accounts securely.
// TODO: Implement server-side account recovery functionality to allow users to recover their accounts in case of forgotten credentials.
// TODO: Implement server-side user profile management to allow users to update their profile information securely.
// TODO: Implement server-side user activity tracking to monitor user interactions with the application.
// TODO: Implement server-side logging for successful logins to monitor user activity and detect suspicious behavior.
// TODO: Implement server-side logging for failed logins to monitor and detect potential security threats.
// TODO: Implement server-side security audits to regularly review and improve the security of the login system.
// TODO: Implement server-side security best practices to ensure the login system is secure and resilient against attacks.
// TODO: Implement server-side security patches to keep the login system up-to-date with the latest security fixes.
// TODO: Implement server-side security monitoring to detect and respond to security incidents in real-time.
// TODO: Implement server-side security training for developers to ensure they are aware of security best practices and how to implement them in the login system.
// TODO: Implement server-side security policies to enforce security standards and practices across the login system.
// TODO: Implement server-side security reviews to regularly assess the security of the login system and identify areas for improvement.
// TODO: Implement server-side security testing to identify vulnerabilities in the login system and ensure it is secure against attacks.
// TODO: Implement server-side security incident response to handle security incidents effectively and minimize their impact on the login system.
// TODO: Implement server-side security compliance to ensure the login system meets relevant security standards and regulations (e.g., GDPR, HIPAA, etc.).
// TODO: Implement server-side security documentation to provide clear guidelines and instructions for developers on how to implement and maintain the security of the login system.
// TODO: Implement server-side security monitoring tools to automate the detection and response to security incidents in the login system.
// TODO: Implement server-side security logging tools to centralize and analyze security logs from the login system.
// TODO: Implement server-side security alerting to notify administrators of potential security threats in the login system.
// TODO: Implement server-side security dashboards to visualize and monitor the security status of the login system.
// TODO: Implement server-side security metrics to measure the effectiveness of security measures in the login system.
// TODO: add basic client-side validation for email/password inputs to improve UX.

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { trackVisit } from "../utils/visitTracker";
import { login } from "../utils/auth";
import { roleHierarchy } from "../constants/roles";
import LoadingSpinner from "../components/LoadingSpinner";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const LoginPage = () => {

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
      </form>
    </div>
  );
};

export default LoginPage;