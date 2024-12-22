import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around list-none">
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
      </ul>
    </nav>
  );
};

export default NavBar;