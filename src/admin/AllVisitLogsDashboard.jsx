import React, { useEffect, useState } from "react";
import { checkRecent } from "../utils/time";
import PropTypes from "prop-types";

const API_ENDPOINT = "https://ldlg09zoq7.execute-api.us-east-2.amazonaws.com/dev/admin";
const CACHE_KEY = "allVisits_cache";
const TIMESTAMP_KEY = "allVisits_cache_timestamp";
const CACHE_LIFETIME = 1000 * 60 * 60 * 24; // 24 hours
const HIGHLIGHT_WINDOW = 1000 * 60 * 60 * 24; // 24 hours

const AllVisitLogsDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const lastUpdated = localStorage.getItem(TIMESTAMP_KEY);

  const fetchFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch all visit logs");

      const data = await response.json();
      setVisits(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromCache = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      setVisits(JSON.parse(cached));
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
    if (isCacheFresh()) {
      loadFromCache();
    } else {
      fetchFromAPI();
    }
  }, []);

    useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = visits.filter(
      (v) =>
        v.path?.toLowerCase().includes(q) ||
        v.ip?.toLowerCase().includes(q) ||
        v.userAgent?.toLowerCase().includes(q)
    );
    setFilteredVisits(filtered);
  }, [searchQuery, visits]);

  const sortVisits = (data) => {
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sorted = sortVisits(filteredVisits);

  const getSummaryStats = () => {

    const uniqueIps = [...new Set(visits.map((v) => v.ip))];

    const pathCounts = visits.reduce((acc, curr) => {
      acc[curr.path] = (acc[curr.path] || 0) + 1;
      return acc;
    }, {});

    const topPage = Object.entries(pathCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const dayCounts = visits.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      total: visits.length,
      unique: uniqueIps.length,
      topPage,
      busiestDay,
    };
  };

  const { total, unique, topPage, busiestDay } = getSummaryStats();

  const HighlightBox = ({ label, value }) => (
    <div className="bg-white dark:bg-gray-800 border p-4 rounded shadow text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  );

  if (loading) return <p className="text-center py-6">Loading logs...</p>;
  if (error) return <p className="text-center text-red-600 py-6">Error: {error}</p>;

  return (
    <div className="overflow-x-auto mt-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <HighlightBox label="Total Visits" value={total} />
        <HighlightBox label="Unique Visitors" value={unique} />
        <HighlightBox label="Top Page" value={topPage} />
        <HighlightBox label="Busiest Day" value={busiestDay} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          All Site Visit Logs
        </h2>
        <div className="flex gap-5 items-center">
          {lastUpdated && (
            <p className="text-md text-right text-gray-600 dark:text-gray-200">
              <strong>Last updated: </strong>{new Date(parseInt(lastUpdated, 10)).toLocaleString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1 rounded"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by path, IP, or user agent"
        className="w-full mb-4 px-4 py-2 rounded border text-gray-600 dark:text-gray-700"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="min-w-full bg-white dark:bg-gray-800 border rounded shadow">
        <thead>
          <tr>
            {[
              { label: "Timestamp", field: "timestamp" },
              { label: "Path", field: "path" },
              { label: "IP Address", field: "ip" },
              { label: "User Agent", field: "userAgent" },
            ].map(({ label, field }) => (
              <th
                key={field}
                onClick={() => {
                  setSortField(field);
                  setSortOrder(
                    sortField === field && sortOrder === "asc" ? "desc" : "asc"
                  );
                }}
                className="cursor-pointer px-4 py-2 border-b text-left text-gray-600
                        dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {label} {sortField === field && (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((visit) => {
            const isRecent = checkRecent(visit.timestamp, HIGHLIGHT_WINDOW);
            return (
              <tr
                key={visit.visitId || `${visit.ip}-${visit.timestamp}`}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isRecent ? "bg-green-200 dark:bg-green-700/20" : ""
                }`}
              >
                <td className="px-4 py-2 border-b text-gray-700
                        dark:text-gray-200">
                  {new Date(visit.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b text-gray-700
                        dark:text-gray-200">{visit.path}</td>
                <td className="px-4 py-2 border-b text-gray-700
                        dark:text-gray-200">{visit.ip}</td>
                <td className="px-4 py-2 border-b truncate text-gray-700
                        dark:text-gray-200 max-w-xs">
                  {visit.userAgent}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

AllVisitLogsDashboard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default AllVisitLogsDashboard;