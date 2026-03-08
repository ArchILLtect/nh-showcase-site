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

const decodeJwtPayload = (token) => {
    try {
        const [, payloadPart] = token.split(".");
        if (!payloadPart) return null;

        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const json = atob(normalized);
        return JSON.parse(json);
    } catch (error) {
        console.error("Failed to decode auth token payload:", error);
        return null;
    }
};

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";
const SESSION_VALIDATE_CACHE_MS = 60000;
let lastSessionValidation = {
    at: 0,
    valid: false,
};

export const getTokenPayload = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return decodeJwtPayload(token);
};

export const isLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
        return false;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
        return true;
    }

    const nowEpoch = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp <= nowEpoch) {
        logout();
        return false;
    }

    try {
        const user = JSON.parse(userData);
        if (
            typeof payload.tokenVersion === "number" &&
            typeof user?.tokenVersion === "number" &&
            payload.tokenVersion !== user.tokenVersion
        ) {
            logout();
            return false;
        }
    } catch (error) {
        console.error("Failed to parse userData while validating auth token:", error);
        logout();
        return false;
    }

    return true;
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
    lastSessionValidation = {
        at: Date.now(),
        valid: true,
    };
};

export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clean up legacy or unused keys
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    lastSessionValidation = {
        at: 0,
        valid: false,
    };
};

export const validateSessionWithServer = async () => {
    if (!isLoggedIn()) {
        return false;
    }

    const now = Date.now();
    if (now - lastSessionValidation.at < SESSION_VALIDATE_CACHE_MS) {
        return lastSessionValidation.valid;
    }

    const token = localStorage.getItem("authToken");
    const user = getLoggedInUser();

    if (!token || !user?.username) {
        logout();
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/session/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: user.username,
                tokenVersion: user.tokenVersion,
            }),
        });

        if (response.status === 401) {
            logout();
            return false;
        }

        if (!response.ok) {
            console.warn("Session validation endpoint unavailable; allowing current session.");
            lastSessionValidation = {
                at: now,
                valid: true,
            };
            return true;
        }

        const payload = await response.json();
        if (!payload?.valid) {
            logout();
            return false;
        }

        const mergedUser = {
            ...user,
            ...(payload.user || {}),
        };
        localStorage.setItem("userData", JSON.stringify(mergedUser));

        lastSessionValidation = {
            at: Date.now(),
            valid: true,
        };
        return true;
    } catch (error) {
        console.warn("Session validation network error; allowing current session.", error);
        lastSessionValidation = {
            at: now,
            valid: true,
        };
        return true;
    }
};
