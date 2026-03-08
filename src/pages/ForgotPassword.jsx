import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { trackVisit } from "../utils/visitTracker";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Forgot Password | Nick Hanson";
    trackVisit();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        username: username.trim(),
        email: email.trim(),
      });

      setMessage(
        response?.data?.message ||
          "If account details are valid, password reset instructions were sent.",
      );
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to process forgot password request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center sm:h-screen bg-gray-100 dark:bg-gray-900 mt-20 sm:mt-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-700 dark:text-gray-100">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
          Enter your username and account email. If they match, we will send a reset link.
        </p>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
            required
          />
        </div>

        {message && <p className="mb-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          } text-white font-semibold transition-colors duration-200 dark:text-gray-100`}
        >
          {loading ? "Sending..." : "Send Reset Instructions"}
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline dark:text-blue-400">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
