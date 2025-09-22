/**
 * File: visitTracker.js
 * Author: Nick Hanson
 * Created On: May 22, 2025
 * Last Updated: May 22, 2025
 * Description: Utility function to track user visits to the site.
 *
 * Props:
 * - None
 *
 * Functions:
 * - trackVisit: Tracks user visits to the site and logs them to an API.
 *
 * Notes:
 * - This function tracks user visits to the site and logs them to an API.
 * - It uses localStorage to manage cooldown periods for session and visit tracking.
 * - The function is designed to be called on page load.
 *
 * Dependencies:
 * - None
 */

const VISIT_API_ENDPOINT =
    "https://9hxx3na0o7.execute-api.us-east-2.amazonaws.com/dev/";
const CONSENT_KEY = "cookieConsent"; // "accepted" | "rejected"
const SESSION_COOLDOWN_MINUTES = 120;
const VISIT_COOLDOWN_MINUTES = 30;

export async function trackVisit() {
    try {
        // Respect consent: skip visit logging unless user accepted
        let consent;
        try {
            consent = localStorage.getItem(CONSENT_KEY);
        } catch (e) {
            console.warn("[visitTracker] localStorage unavailable:", e);
            return;
        }
        if (consent !== "accepted") {
            console.log("[visitTracker] Skipped (no consent)");
            return;
        }

        const path = window.location.pathname;
        const normalizedPath = path?.toLowerCase() || "/";
        const sessionCooldownKey = `session_cooldown_${normalizedPath}`;
        const visitCooldownKey = `visit_cooldown_${normalizedPath}`;
        const now = Date.now();

        const initialVisit = parseInt(
            localStorage.getItem(sessionCooldownKey),
            10
        );
        const lastVisit = parseInt(localStorage.getItem(visitCooldownKey), 10);

        const sessionActive =
            initialVisit &&
            now - initialVisit < SESSION_COOLDOWN_MINUTES * 60 * 1000;
        const visitCoolingDown =
            lastVisit && now - lastVisit < VISIT_COOLDOWN_MINUTES * 60 * 1000;

        if (sessionActive && visitCoolingDown) {
            console.log(`[visitTracker] Cooldown active for ${path}`);
            return;
        }

        // Send IP + visit info
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        const visitData = {
            ip,
            userAgent: navigator.userAgent,
            path,
        };

        await fetch(VISIT_API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitData),
        });

        // Only set session key if it doesn't exist or session expired
        if (!sessionActive) {
            localStorage.setItem(sessionCooldownKey, now.toString());
        }

        // Always update visit timestamp
        localStorage.setItem(visitCooldownKey, now.toString());

        console.log(`[visitTracker] Visit logged for ${path}`);
    } catch (err) {
        console.warn("[visitTracker] Visit log failed:", err);
    }
}
