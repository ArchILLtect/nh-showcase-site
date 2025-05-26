/**
 * File: auth.js
 * Author: Nick Hanson
 * Created On: December 23, 2024
 * Last Updated: December 23, 2024
 * Description: Utility functions for user auth operations across the showcase website.
 *
 * Functions:
 * - isLoggedIn: Checks if the user is logged in by checking for a token in localStorage.
 * - getLoggedInUser: Retrieves the logged-in user's data from localStorage.
 * - login: Stores the user's token and data in localStorage.
 * - logout: Clears the user's token and data from localStorage.
 *
 * Props:
 * - None
 *
 * Notes:
 * - Functions are pure and do not modify input parameters.
 * - Uses localStorage for storing user data and token.
 * - Assumes the token is a string and user data is a JSON object.
 */

// TODO: Integrating token expiration handling.

export const isLoggedIn = () => {
    const token = localStorage.getItem("authToken"); // Check for token in localStorage
    // TODO: Validate the token (optional: implement validation with backend)
    return !!token; // Convert to boolean (true if token exists, false otherwise)
};

export const getLoggedInUser = () => {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch (e) {
        console.error("Failed to parse userData:", e);
        return null;
    }
};

export const login = (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
};

export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clean up legacy or unused keys
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
};
