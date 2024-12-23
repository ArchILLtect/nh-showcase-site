/**
 * File: auth.js
 * Author: Nick Hanson
 * Created On: December 23, 2024
 * Last Updated: December 23, 2024
 * Description: Utility functions for user auth operations across the showcase website.
 *
 * Functions:
 * - // TODO: Add content in these comment sections
 *
 * Notes:
 * - Functions are pure and do not modify input parameters.
 */

// TODO: For future security upgrades, consider integrating token expiration handling.


export const isLoggedIn = () => {
    const token = localStorage.getItem('authToken'); // Check for token in localStorage
    // TODO: Validate the token (optional: implement validation with backend)
    return !!token; // Convert to boolean (true if token exists, false otherwise)
  };
  
  export const login = (token) => {
    localStorage.setItem('authToken', token); // Save token to localStorage
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
  };