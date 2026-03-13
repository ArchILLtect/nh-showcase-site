/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: May 25, 2024
 * Description: The layout component that wraps around all pages.
 * 
 * Props:
 * - children: The content to be displayed inside the layout.
 * 
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 * 
 * Dependencies:
 * - React
 * - PropTypes: A library for type checking React props.
 * - NavBar: A component for the navigation bar.
 * - Footer: A component for the footer.
 * 
 */

import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CookieNotice from "./CookieNotice";
import EmailVerificationBanner from "./EmailVerificationBanner";
import PropTypes from 'prop-types';

Layout.propTypes = {
    children: PropTypes.object.isRequired
};

export default function Layout({ children }) {

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const toggleScrollButton = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleScrollButton);
    return () => window.removeEventListener("scroll", toggleScrollButton);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-white">
      <NavBar />
      <EmailVerificationBanner />
        <main className="p-4 pb-28">{children}</main>
      <CookieNotice />
      <Footer />

      {/* Scroll to top button */}
      {showScroll && (
        <div className="text-center">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-16 z-50 bg-opacity-70 bg-blue-600 text-white hover:bg-blue-700 transition rounded-full p-3 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}