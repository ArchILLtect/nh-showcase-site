import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLoggedInUser, isLoggedIn } from "../utils/auth";

const API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";
const DISMISS_PREFIX = "emailVerifyBannerDismissed:";
const DEFAULT_COOLDOWN_SECONDS = 60;

const getDismissKey = (username) => `${DISMISS_PREFIX}${username || "unknown"}`;

export default function EmailVerificationBanner() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const isUnverified =
    !!currentUser &&
    typeof currentUser.emailVerified === "boolean" &&
    currentUser.emailVerified === false;

  const canRender = isUnverified && !dismissed;

  const cooldownLabel = useMemo(() => {
    if (cooldownRemaining <= 0) return "";
    return ` (${cooldownRemaining}s)`;
  }, [cooldownRemaining]);

  const refreshUser = () => {
    if (!isLoggedIn()) {
      setCurrentUser(null);
      setDismissed(false);
      return;
    }

    const user = getLoggedInUser();
    setCurrentUser(user);

    const dismissKey = getDismissKey(user?.username);
    const wasDismissed = localStorage.getItem(dismissKey) === "true";
    setDismissed(wasDismissed);
  };

  useEffect(() => {
    refreshUser();
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  useEffect(() => {
    refreshUser();
  }, [location.pathname]);

  useEffect(() => {
    if (cooldownRemaining <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCooldownRemaining((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownRemaining]);

  const dismissBanner = () => {
    if (!currentUser?.username) {
      setDismissed(true);
      return;
    }

    const dismissKey = getDismissKey(currentUser.username);
    localStorage.setItem(dismissKey, "true");
    setDismissed(true);
  };

  const handleResend = async () => {
    if (!currentUser?.username || !currentUser?.email || resending || cooldownRemaining > 0) {
      return;
    }

    try {
      setResending(true);
      setStatusType("info");
      setStatusMessage("");

      const response = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          email: currentUser.email,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Could not resend verification email right now.");
      }

      setStatusType("success");
      setStatusMessage(
        payload?.message || "If account details are valid, verification instructions were sent.",
      );
      setCooldownRemaining(DEFAULT_COOLDOWN_SECONDS);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Could not resend verification email right now.");
    } finally {
      setResending(false);
    }
  };

  if (!canRender) {
    return null;
  }

  const statusTextClass =
    statusType === "error"
      ? "text-red-700 dark:text-red-300"
      : statusType === "success"
        ? "text-green-700 dark:text-green-300"
        : "text-gray-700 dark:text-gray-300";

  return (
    <div className="mx-4 mt-4 rounded border border-blue-300 bg-blue-50 p-3 text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          Your email is not verified yet. Verify it to keep account recovery and future protected features available.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldownRemaining > 0}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {resending ? "Sending..." : `Resend verification${cooldownLabel}`}
          </button>
          <button
            type="button"
            onClick={dismissBanner}
            className="rounded border border-gray-400 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
      {statusMessage && <p className={`mt-2 text-sm ${statusTextClass}`}>{statusMessage}</p>}
    </div>
  );
}
