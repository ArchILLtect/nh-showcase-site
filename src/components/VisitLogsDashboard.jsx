/**
 * File: VisitLogsDashboard.jsx
 * Author: Nick Hanson
 * Created On: May 22, 2025
 * Last Updated: May 22, 2025
 * Description: Utility function to track user visits to the site.
 * 
 * Props:
 * // - None
 * 
 * Notes:
 * - This function tracks user visits to the site and logs them to an API.
 * - It uses localStorage to manage cooldown periods for session and visit tracking.
 * - The function is designed to be called on page load.
 * 
 * Dependencies:
 * - None
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const API_BASE_URL = "https://ldlg09zoq7.execute-api.us-east-2.amazonaws.com/dev/";
const CACHE_KEY = "visitLogs_cache";
const TIMESTAMP_KEY = "visitLogs_timestamp";
const CACHE_LIFETIME = 1000 * 60 * 60 * 24; // 24 hours

const VisitLogsDashboard = ({ ipInfo }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  const knownIps = ipInfo?.map(entry => entry.ip).filter(Boolean) || [];
  const lastUpdated = localStorage.getItem("visitLogs_timestamp");

  const fetchFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knownIps }),
      });

      if (!response.ok) throw new Error("Failed to fetch visit logs");

      const data = await response.json();
      setVisits(data);

      // Cache it locally
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromCache = () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setVisits(JSON.parse(cachedData));
      setLoading(false);
    }
  };

  const isCacheFresh = () => {
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return false;
    return Date.now() - parseInt(timestamp, 10) < CACHE_LIFETIME;
  };

  const handleRefresh = () => {
    fetchFromAPI();
  };

  useEffect(() => {
    if (knownIps.length > 0) {
      if (isCacheFresh()) {
        loadFromCache();
      } else {
        fetchFromAPI();
      }
    }
  }, [ipInfo]);

  const sortVisits = (data) => {
    return [...data].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
    };

  const sortedVisits = sortVisits(visits);

    const getMostVisitedPath = () => {
    const counts = {};
    visits.forEach((v) => {
        counts[v.path] = (counts[v.path] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "N/A";
    };

    const getFirstVisit = () => {
    return visits.reduce((min, v) => v.timestamp < min.timestamp ? v : min, visits[0]);
    };

    const getLastVisit = () => {
    return visits.reduce((max, v) => v.timestamp > max.timestamp ? v : max, visits[0]);
    };

    const formatDate = (visit) =>
    visit ? new Date(visit.timestamp).toLocaleString() : "N/A";

  if (loading)
    return <div className="text-center py-8 text-gray-600">Loading visit logs...</div>;

  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="overflow-x-auto mt-6 mb-10">
        <div className="flex justify-around">
            <div className="my-8 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700
                    px-5 pt-2 pb-4 rounded shadow-md border-gray-600 dark:border-gray-400 border-2">
                <h3 className="text-xl text-gray-800 dark:text-gray-200 font-bold text-center mb-4">
                    📊 Visit Highlights 📊
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg">
                    <li>Total visits: <strong>{visits.length}</strong></li>
                    <li>Most visited page: <strong>{getMostVisitedPath()}</strong></li>
                    <li>First visit: <strong>{formatDate(getFirstVisit())}</strong></li>
                    <li>Last visit: <strong>{formatDate(getLastVisit())}</strong></li>
                </ul>
            </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800
                rounded shadow mb-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Your Visit Logs
            </h2>
            <div className="flex gap-5 items-center">
                {lastUpdated && (
                    <div className="text-md text-right text-gray-600 dark:text-gray-400">
                        <strong>Last updated:</strong> {new Date(parseInt(lastUpdated, 10)).toLocaleString()}
                    </div>
                )}
                <button
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                🔄 Refresh
                </button>
            </div>
        </div>
        <div className="overflow-x-auto border rounded shadow">
            <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                    <tr>
                        <th
                            className="cursor-pointer px-4 py-2 border-b text-left text-gray-600
                                    dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                                setSortField("timestamp");
                                setSortOrder((prev) => (sortField === "timestamp" && prev === "asc" ? "desc" : "asc"));
                            }}
                        >
                            Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        <th
                            className="cursor-pointer px-4 py-2 border-b text-left text-gray-600
                                    dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                                setSortField("path");
                                setSortOrder((prev) => (sortField === "path" && prev === "asc" ? "desc" : "asc"));
                            }}
                        >
                            Path {sortField === "path" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        <th
                            className="cursor-pointer px-4 py-2 border-b text-left text-gray-600
                                    dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                                setSortField("ip");
                                setSortOrder((prev) => (sortField === "ip" && prev === "asc" ? "desc" : "asc"));
                            }}
                        >
                            IP Address {sortField === "ip" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        <th
                            className="cursor-pointer px-4 py-2 border-b text-left text-gray-600
                                    dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                                setSortField("userAgent");
                                setSortOrder((prev) => (sortField === "userAgent" && prev === "asc" ? "desc" : "asc"));
                            }}
                        >
                            User Agent {sortField === "userAgent" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedVisits.map((visit) => (
                        <tr key={visit.visitId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 border-b text-sm text-gray-800 dark:text-gray-200">
                            {new Date(visit.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-800 dark:text-gray-200">
                            {visit.path}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-800 dark:text-gray-200">
                            {visit.ip}
                        </td>
                        <td className="px-4 py-2 border-b text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs">
                            {visit.userAgent}
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

VisitLogsDashboard.propTypes = {
  ipInfo: PropTypes.arrayOf(
    PropTypes.shape({
      ip: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default VisitLogsDashboard;
