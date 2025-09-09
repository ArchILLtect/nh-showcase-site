import { React, useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Reusable submenu item class generator
const submenuItem = (isActive) =>
  `block px-4 py-2 text-sm rounded-sm ${
    isActive
      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
  }`;

function AboutMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click & Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <li className="relative" ref={menuRef}>
      {/* Toggle */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:bg-gray-300 text-white hover:text-gray-800 px-5 py-2 no-underline rounded hover:text-lg"
      >
        About Me
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Submenu */}
      {open && (
        <div
          role="menu"
          aria-label="About Me submenu"
          className="absolute left-0 mt-2.5 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black/5 z-50"
        >
          <NavLink to="/about" role="menuitem" className={({ isActive }) => submenuItem(isActive)}>
            Overview
          </NavLink>
          <NavLink to="/experience" role="menuitem" className={({ isActive }) => submenuItem(isActive)}>
            Experience
          </NavLink>
          <NavLink to="/certificates" role="menuitem" className={({ isActive }) => submenuItem(isActive)}>
            Certifications
          </NavLink>
        </div>
      )}
    </li>
  );
}
export default AboutMenu;