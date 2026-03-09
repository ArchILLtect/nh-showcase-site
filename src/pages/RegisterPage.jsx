/**
 * File: RegisterPage.jsx
 * Author: Nick Hanson
 * Created On: December 22, 2024
 * Last Updated: July 25, 2025
 * Description: The registration page for the showcase site.
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
 * - React Router
 * - useNavigate: A hook for programmatic navigation.
 * - axios: A promise-based HTTP client for making API requests.
 * - LoadingSpinner: A component for displaying a spinner during loading times.
 */

// TODO: Implement a success message (toast) with redirect after successful registration
// TODO: Add a "show password" toggle for the password fields
// TODO: Add a "Username Availability Check" to inform users if their chosen username is already taken
// TODO: Implement a loading state while the registration request is being processed
// TODO: Add a loading spinner or animation while the registration request is being processed
// TODO: Add a password strength meter to guide users in creating strong passwords

// TODO: Add a "Profile Customization" option for users to personalize their account during registration
// TODO: Add a "Account Settings" link for users to manage their account preferences after registration
// TODO: Add a "Profile Picture Upload" option for users to personalize their account during registration
// TODO: Add a "Two-Factor Authentication" option for users to enhance account security
// TODO: Add a "Password Recovery" option for users who may forget their password after registration

// TODO: Add a "Remember Me" option for users who want to stay logged in after registration

// TODO: Add form validation for email format and password strength
// TODO: Consider adding a CAPTCHA to prevent spam registrations


// TODO: Add error handling for network issues and display user-friendly messages
// TODO: Consider using a form library like Formik or React Hook Form for better form management
// TODO: Add unit tests for the registration functionality
// TODO: Add accessibility features such as ARIA labels and roles
// TODO: Add a link to the privacy policy and terms of service

// TODO: Implement server-side validation to ensure data integrity
// TODO: Add a "Resend Verification Email" option for users who haven't received the verification email
// TODO: Add a "Forgot Password" link for users who may need to reset their password after registration
// TODO: Add a confirmation step before submitting the registration form
// TODO: Add a "Terms and Conditions" checkbox that users must agree to before registering
// TODO: Add a "Privacy Policy" link that users can review before registering
// TODO: Add a "Back to Home" link for users who want to return to the homepage without registering
// TODO: Add a "Contact Support" link for users who may have questions or issues during registration
// TODO: Add a "Social Media Login" option for users who prefer to register using their social media accounts
// TODO: Add a "Language Selection" option for users to choose their preferred language during registration
// TODO: Add a "Dark Mode" toggle for users who prefer a dark theme during registration
// TODO: Add a "Light Mode" toggle for users who prefer a light theme during registration
// TODO: Add a "Terms of Service" checkbox that users must agree to before registering
// TODO: Add a "Privacy Policy" checkbox that users must agree to before registering
// TODO: Add a "Newsletter Subscription" option for users who want to receive updates and news
// TODO: Add a "Terms of Use" link that users can review before registering
// TODO: Add a "Privacy Settings" option for users to customize their account privacy during registration
// TODO: Add a "Account Deletion" option for users who may want to delete their account in the future
// TODO: Add a "Feedback" option for users to provide suggestions or report issues during registration
// TODO: Add a "User Agreement" checkbox that users must agree to before registering
// TODO: Add a "Security Questions" option for users to enhance account security during registration
// TODO: Add a "Help Center" link for users to access support resources during registration
// TODO: Add a "Community Guidelines" link for users to review acceptable behavior and usage policies
// TODO: Add a "Frequently Asked Questions (FAQ)" link for users to find answers to common questions during registration
// TODO: Add a "User Manual" link for users to access detailed instructions and guides during registration
// TODO: Add a "Terms of Service" link that users can review before registering
// TODO: Add a "Privacy Policy" link that users can review before registering
// TODO: Add a "Cookie Policy" link that users can review before registering
// TODO: Add a "Data Protection" link that users can review before registering
// TODO: Add a "User Rights" link that users can review before registering
// TODO: Add a "Accessibility Statement" link that users can review before registering

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "qwerty",
  "qwerty123",
  "letmein",
  "welcome",
  "admin",
  "administrator",
  "iloveyou",
  "abc123",
  "12345678",
  "123456789",
  "1234567890",
  "passw0rd",
  "dragon",
  "monkey",
  "football",
  "baseball",
  "trustno1",
]);

const normalizePasswordForWeakCheck = (password) =>
  String(password || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: '',
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = Date.now();

    const normalizedEmail = formData.email.trim().toLowerCase();
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasLower = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSymbol = /[^A-Za-z0-9]/.test(formData.password);

    if (!normalizedEmail || normalizedEmail.length > MAX_EMAIL_LENGTH) {
      alert(`Email must be at most ${MAX_EMAIL_LENGTH} characters.`);
      return;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      alert(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      alert("Password must include uppercase, lowercase, a number, and a symbol.");
      return;
    }

    const normalizedPassword = normalizePasswordForWeakCheck(formData.password);
    if (COMMON_WEAK_PASSWORDS.has(normalizedPassword)) {
      alert("Password is too common. Please choose a stronger password.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSend = {
      ...formData,
      email: normalizedEmail,
      role: "user"
    };

    try {
      setLoading(true); // show spinner
      const response = await axios.post(`${API_BASE_URL}/register`, dataToSend);
      console.log("Registration successful:", response.data);
      alert(response?.data?.message || "User registered successfully!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Error registering user");
    } finally {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), delay); // ⏳ delay cleanup
    }
  };

  return (
    <div className="flex justify-center items-center sm:h-screen bg-gray-100 dark:bg-gray-900
        mt-4 sm:mt-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-gray-100">
          Register
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
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 caret-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:caret-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={MAX_EMAIL_LENGTH}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 caret-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:caret-gray-100"
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
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 caret-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:caret-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 caret-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:caret-gray-100"
                required
              />
            </div>
            <div className="mb-4">
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
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Register
            </button>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                Login here
              </a>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;