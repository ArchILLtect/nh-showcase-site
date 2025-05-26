/**
 * File: time.js
 * Author: Nick Hanson
 * Created On: May 25, 2024
 * Last Updated: May 25, 2025
 * Description: Utility functions for time-related operations.
 *
 * Functions:
 * - checkRecent: Checks if a given ISO date string is within a specified time window.
 *
 * Notes:
 * - The checkRecent function compares the current time with a given ISO date string.
 * - It returns true if the date string is within the specified time window (default is 24 hours).
 * - The function uses the Date object to parse the ISO string and get the current time.
 * - The function is useful for determining if an event occurred recently.
 *
 * Dependencies:
 * - None
 */

/**
 * checkRecent
 *
 * This function checks if a given ISO date string is within a specified time window.
 * It returns true if the date string is within the specified time window (default is 24 hours).
 *
 * It uses the Date object to parse the ISO string and get the current time.
 * The function is useful for determining if an event occurred recently.
 *
 * @function checkRecent
 * @param {string} isoString - The ISO date string to check.
 * @param {number} [windowMs=24*60*60*1000] - The time window in milliseconds (default is 24 hours).
 *
 * @returns {boolean} - Returns true if the date string is within the specified time window, false otherwise.
 *
 * @description
 * This function checks if a given ISO date string is within a specified time window.
 * It returns true if the date string is within the specified time window (default is 24 hours).
 *
 * It uses the Date object to parse the ISO string and get the current time.
 * The function is useful for determining if an event occurred recently.
 *
 * @example
 * // Check if a visit occurred within the last 24 hours
 * const visitTime = "2024-05-25T12:00:00Z";
 * const isRecent = checkRecent(visitTime);
 * console.log(isRecent); // true or false
 *
 * // Check if a visit occurred within the last 1 hour
 * const visitTime = "2024-05-25T12:00:00Z";
 * const isRecent = checkRecent(visitTime, 60 * 60 * 1000);
 * console.log(isRecent); // true or false
 *
 * // Check if a visit occurred within the last 10 minutes
 * const visitTime = "2024-05-25T12:00:00Z";
 * const isRecent = checkRecent(visitTime, 10 * 60 * 1000);
 * console.log(isRecent); // true or false
 */
export const checkRecent = (isoString, windowMs = 24 * 60 * 60 * 1000) => {
    const ts = new Date(isoString).getTime();
    return Date.now() - ts < windowMs;
};
