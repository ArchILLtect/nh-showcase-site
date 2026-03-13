/**
 * File: Footer.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The footer component for the showcase site.
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate, Link } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth.js";

const Footer = () => {

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout()
    console.log("User logged out!");
    navigate("/login");
  };

  return (
    <footer className="bg-gray-800 text-gray-100 flex flex-col sm:flex-row text-center py-2
        fixed w-full bottom-0 justify-around items-center z-50">
        <p>
          &copy; {currentYear} Nick Hanson Sr. All rights reserved.{" · "}
          <Link to="/privacy" className="underline hover:text-gray-300">
            Privacy
          </Link>
        </p>
        {/* Login/Logout Button */}
        <div>
          {isLoggedIn() ? (
            <button
              onClick={handleLogout}
              className="
                hover:bg-gray-300
                text-white
                hover:font-medium
                hover:text-gray-800
                px-5
                py-0.5
                no-underline
                hover:text-lg
                flex
                gap-2
                items-center"
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
          ) : (<p></p>)}
      </div>
      <DarkModeToggle />
    </footer>
  );
};

export default Footer;