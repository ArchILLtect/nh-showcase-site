/**
 * File: NavBar.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
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

import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js"; // Import the helper function

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token
    console.log("User logged out!");
    navigate("/login"); // Redirect to login page
  };
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around items-center list-none">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
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
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
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
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
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
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
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
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
            }
          >
            Contact
            </NavLink>
        </li>
        <li>
      {/* Login/Logout Button */}
      <div>
        {isLoggedIn() ? (
          <button
            onClick={handleLogout}
            className="text-white px-5 py-2 no-underline hover:text-yellow-400 flex gap-2 items-center"
          >
            Logout
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
                d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              ></path>
              <path
                fillRule="evenodd"
                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
              ></path>
            </svg>
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-5 py-2 no-underline flex gap-2 items-center flex-row"
                : "text-white px-5 py-2 no-underline flex gap-2 items-center flex-row hover:text-yellow-400"
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