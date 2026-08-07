/**
 * File: NavBar.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: May 22, 2025
 * Description: The navigation component for the showcase site.
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

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SubMenu from "./SubMenu";
import { isLoggedIn, getLoggedInUser } from "../utils/auth.js";
import { roleHierarchy } from "../constants/roles.js";

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const menuPanelRef = useRef(null);
  const menuToggleRef = useRef(null);
  const firstMenuControlRef = useRef(null);
  const wasMenuOpenRef = useRef(false);
  const location = useLocation();

  const user = getLoggedInUser();
  const userLevel = user?.role ? roleHierarchy[user.role] ?? 0 : 0;

  const mobileAction = loggedIn
    ? userLevel > 1
      ? { to: "/admin/dashboard", label: "Admin Dashboard" }
      : { to: "/dashboard", label: "Dashboard" }
    : { to: "/login", label: "Login" };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenAccordion(null);
  };

  const handleMobileLinkSelect = () => {
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    if (mobileMenuOpen) {
      setOpenAccordion(null);
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion((current) => (current === section ? null : section));
  };

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

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleOutsidePointer = (event) => {
      const clickedMenu = menuPanelRef.current?.contains(event.target);
      const clickedToggle = menuToggleRef.current?.contains(event.target);
      if (!clickedMenu && !clickedToggle) {
        closeMobileMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("touchstart", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("touchstart", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      wasMenuOpenRef.current = true;
      requestAnimationFrame(() => {
        firstMenuControlRef.current?.focus();
      });
      return;
    }

    if (wasMenuOpenRef.current) {
      menuToggleRef.current?.focus();
      wasMenuOpenRef.current = false;
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : originalPaddingRight;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [mobileMenuOpen]);

  const mainLinkClass = ({ isActive }) =>
    isActive
      ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg"
      : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg";

  const mobilePrimaryLinkClass = ({ isActive }) =>
    `block w-full min-h-11 rounded-md px-4 py-3 text-[15px] leading-5 font-medium no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${
      isActive ? "bg-gray-300 text-gray-800" : "text-white hover:bg-gray-700"
    }`;

  const mobileNestedLinkClass = ({ isActive }) =>
    `block w-full min-h-11 rounded-md px-5 py-2.5 text-sm leading-5 no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${
      isActive ? "bg-gray-300 text-gray-800 font-medium" : "text-gray-100 hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-gray-800 relative z-50">
      <div className="md:hidden px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="flex min-h-12 items-center justify-between">
          <NavLink
            to="/home"
            className="text-white text-[15px] font-medium no-underline rounded-md px-2 py-2 hover:bg-gray-300 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            onClick={handleMobileLinkSelect}
          >
            Nick Hanson
          </NavLink>

          <button
            type="button"
            ref={menuToggleRef}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-nav-drawer"
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-gray-300 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          id="mobile-nav-drawer"
          ref={menuPanelRef}
          className={`absolute left-0 right-0 top-full z-50 bg-gray-800 border-t border-gray-700 shadow-lg overflow-hidden transition-all duration-200 ease-out ${
            mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <ul className="px-3 py-2.5 space-y-1.5">
            <li>
              <NavLink
                to="/home"
                ref={firstMenuControlRef}
                onClick={handleMobileLinkSelect}
                className={mobilePrimaryLinkClass}
              >
                Home
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                aria-expanded={openAccordion === "projects" ? "true" : "false"}
                aria-controls="mobile-projects-submenu"
                onClick={() => toggleAccordion("projects")}
                className="flex w-full min-h-11 items-center justify-between rounded-md px-4 py-3 text-left text-[15px] leading-5 font-medium text-white hover:bg-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                Projects
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${openAccordion === "projects" ? "rotate-180" : ""}`}
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
              <div
                id="mobile-projects-submenu"
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  openAccordion === "projects" ? "max-h-40 opacity-100 pb-1" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-1.5 px-2">
                  <NavLink to="/projects" onClick={handleMobileLinkSelect} className={mobileNestedLinkClass}>
                    My Projects
                  </NavLink>
                  <NavLink to="/future-projects" onClick={handleMobileLinkSelect} className={mobileNestedLinkClass}>
                    Future Projects
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                aria-expanded={openAccordion === "about" ? "true" : "false"}
                aria-controls="mobile-about-submenu"
                onClick={() => toggleAccordion("about")}
                className="flex w-full min-h-11 items-center justify-between rounded-md px-4 py-3 text-left text-[15px] leading-5 font-medium text-white hover:bg-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                About
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${openAccordion === "about" ? "rotate-180" : ""}`}
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
              <div
                id="mobile-about-submenu"
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  openAccordion === "about" ? "max-h-40 opacity-100 pb-1" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-1.5 px-2">
                  <NavLink to="/about" onClick={handleMobileLinkSelect} className={mobileNestedLinkClass}>
                    Overview
                  </NavLink>
                  <NavLink to="/certificates" onClick={handleMobileLinkSelect} className={mobileNestedLinkClass}>
                    Certifications
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <NavLink to="/blog" onClick={handleMobileLinkSelect} className={mobilePrimaryLinkClass}>
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={handleMobileLinkSelect} className={mobilePrimaryLinkClass}>
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/pay" onClick={handleMobileLinkSelect} className={mobilePrimaryLinkClass}>
                Client Payment
              </NavLink>
            </li>
            <li>
              <NavLink
                to={mobileAction.to}
                onClick={handleMobileLinkSelect}
                className={({ isActive }) => {
                  const base = mobilePrimaryLinkClass({ isActive });
                  return `${base} flex items-center gap-2`;
                }}
              >
                {mobileAction.label}
                {!loggedIn && (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    className="text-xl"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                    />
                  </svg>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <ul className="hidden md:flex justify-around items-center list-none p-4">
        <li>
          <NavLink to="/home" className={mainLinkClass}>
            Home
          </NavLink>
        </li>
        <SubMenu topic="Projects" />
        <SubMenu topic="About" />
        <li>
          <NavLink to="/blog" className={mainLinkClass}>
            Blog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg h-28"
                : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg"
            }
          >
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/pay" className={mainLinkClass}>
            Client Payment
          </NavLink>
        </li>
        <li>
          <div>
            {loggedIn ? (
              userLevel > 1 ? (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-gray-300 text-gray-800 font-medium px-5 py-2 no-underline hover:text-lg h-15"
                      : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline hover:text-lg h-15"
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
                    ? "bg-gray-300 text-orange-600 hover:font-medium px-5 py-2 no-underline flex gap-2 items-center flex-row max-h-10"
                    : "hover:bg-gray-300 text-white hover:font-medium hover:text-gray-800 px-5 py-2 no-underline flex gap-2 items-center flex-row"
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
                  />
                  <path
                    fillRule="evenodd"
                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
              </NavLink>
            )}
          </div>
        </li>
      </ul>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
          className="md:hidden fixed inset-0 bg-black/30 z-30"
        />
      )}
    </nav>
  );
};

export default NavBar;
