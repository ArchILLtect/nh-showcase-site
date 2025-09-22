/**
 * File: CookieNotice.jsx
 * Author: Nick Hanson
 * Created On: September 22, 2025
 * Last Updated: September 22, 2025
 * Description: Site-wide cookie/localStorage consent banner.
 *
 * Notes:
 * - Persists consent in localStorage under key: "cookieConsent" with values "accepted" | "rejected".
 * - Renders only when consent is not yet provided.
 * - Uses Tailwind + dark variants; positioned above fixed Footer.
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "cookieConsent";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      if (!value) setVisible(true);
    } catch (e) {
      console.warn('[CookieNotice] localStorage unavailable:', e);
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch (e) {
      // Ignore storage errors (e.g., private mode, quota exceeded)
      console.warn('[CookieNotice] Failed to set cookieConsent:', e);
    }
    setVisible(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "rejected");
    } catch (e) {
      console.warn('[CookieNotice] Failed to set cookieConsent:', e);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and local storage notice"
      className="fixed left-1/2 -translate-x-1/2 bottom-16 z-50 max-w-3xl w-[92%] sm:w-[640px]
                 bg-gray-900 text-gray-100 dark:bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4"
    >
      <p className="text-sm leading-6">
        This site uses local storage and cookies to improve your experience, including saving login
        state and basic visit analytics. See our <Link to="/privacy" className="text-blue-400 underline">Privacy & Cookies</Link> page for details.
      </p>
      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={reject}
          className="px-4 py-2 text-sm rounded border border-gray-600 hover:bg-gray-700"
          aria-label="Reject non-essential storage"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Accept all"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
