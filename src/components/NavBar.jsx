/**
 * File: NavBar.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: May 22, 2025
 * Description: The navigation component for the showcase site.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { isLoggedIn, getLoggedInUser } from "../utils/auth.js";
import { roleHierarchy } from "../constants/roles.js";

const NavBar = () => {

  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const user = getLoggedInUser();
  const userLevel = user?.role ? roleHierarchy[user.role] ?? 0 : 0;

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(isLoggedIn());
    };

    // Listen for storage changes (e.g., login/logout from another tab)
    window.addEventListener("storage", handleStorageChange);

    // Optional: manual trigger if something else modifies localStorage
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around items-center list-none flex-col sm:flex-row">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            About Me
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Blog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Contact
            </NavLink>
        </li>
        <li>
      {/* Login/Logout Button */}
      <div>
        {loggedIn ? (
          userLevel > 1 ? (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Admin Dashboard
          </NavLink>
           ) : (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Dashboard
          </NavLink>
           )         
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-5 py-2 no-underline flex gap-2 items-center flex-row"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg flex gap-2 items-center flex-row"
            }
          >
            Login
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              className="text-xl"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
              ></path>
              <path
                fillRule="evenodd"
                d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              ></path>
            </svg>
          </NavLink>
        )}
      </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;