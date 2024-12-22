import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
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
            to="/resume"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-5 py-2 no-underline"
                : "text-white px-5 py-2 no-underline hover:text-yellow-400"
            }
          >
            Resume
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
          <NavLink 
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-5 py-2 no-underline flex gap-2 items-center flex-row"
                : "text-white px-5 py-2 no-underline flex gap-2 items-center flex-row hover:text-yellow-400"
            }
          >
            Login
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16"
                    className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"></path>
                        <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"></path>
            </svg>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;