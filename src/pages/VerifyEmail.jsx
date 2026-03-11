/**
 * File: VerifyEmail.jsx
 * Author: Nick Hanson
 * Created On: March 05, 2026
 * Last Updated: March 11, 2026
 * Description: The verify email page for the showcase site.
 * This is where the user can verify their email address.
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
 * - useMemo: A React hook for memoizing values.
 * - useSearchParams: A React Router hook for accessing URL search parameters.
 * - AppModal: A component to display a modal with a live demo of the app.
 * - trackVisit: A utility function to track visits to the verify email page.
 * - LoadingSpinner: A component for display a spinner during loading times.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { trackVisit } from "../utils/visitTracker";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Verify Email | Nick Hanson";
    trackVisit();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      if (!token) {
        if (!isMounted) return;
        setSuccess(false);
        setMessage("Verification token is missing from the link.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/verify-email`, { token });

        if (!isMounted) return;
        setSuccess(true);
        setMessage(response?.data?.message || "Email verified successfully.");

        const userDataRaw = localStorage.getItem("userData");
        if (userDataRaw) {
          try {
            const parsed = JSON.parse(userDataRaw);
            const merged = {
              ...parsed,
              emailVerified: true,
            };
            localStorage.setItem("userData", JSON.stringify(merged));
            window.dispatchEvent(new Event("storage"));
          } catch {
            localStorage.removeItem("userData");
          }
        }
      } catch (error) {
        if (!isMounted) return;
        setSuccess(false);
        setMessage(error?.response?.data?.message || "Unable to verify email.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="flex justify-center items-center sm:h-screen bg-gray-100 dark:bg-gray-900 mt-20 sm:mt-0">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-100">Verify Email</h2>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Verifying your email...</p>
        ) : (
          <>
            <p
              className={`mb-4 ${
                success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>

            {success ? (
              <Link to="/dashboard" className="text-blue-500 hover:underline dark:text-blue-400">
                Continue to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-blue-500 hover:underline dark:text-blue-400">
                Go to Login
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
