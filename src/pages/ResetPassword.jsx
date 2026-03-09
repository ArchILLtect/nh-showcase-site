import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { trackVisit } from "../utils/visitTracker";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);

  useEffect(() => {
    document.title = "Reset Password | Nick Hanson";
    trackVisit();
  }, []);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigate, success]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token || !newPassword || !confirmPassword) {
      setError("Token, new password, and confirm password are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/reset-password`, {
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to reset password.");
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
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-gray-100">
          Reset Password
        </h2>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 mb-4">Password reset successful.</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Redirecting to login in 3 seconds...
            </p>
            <Link to="/login" className="text-blue-500 hover:underline dark:text-blue-400">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="token" className="block mb-2 text-gray-700 dark:text-gray-300">
                Reset Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-2 text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                required
              />
              <ul className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-300">
                <li className={hasMinLength ? "text-green-600 dark:text-green-400" : ""}>
                  At least 8 characters
                </li>
                <li className={hasUppercase ? "text-green-600 dark:text-green-400" : ""}>
                  At least 1 uppercase letter
                </li>
                <li className={hasLowercase ? "text-green-600 dark:text-green-400" : ""}>
                  At least 1 lowercase letter
                </li>
                <li className={hasNumber ? "text-green-600 dark:text-green-400" : ""}>
                  At least 1 number
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="checkbox"
                id="show_password_check"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label htmlFor="show_password_check" className="w-full px-4 py-2 text-gray-700 dark:text-gray-100">
                {showPassword ? "Hide Password" : "Show Password"}
              </label>
            </div>

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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
