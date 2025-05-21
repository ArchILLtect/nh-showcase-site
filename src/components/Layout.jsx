/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: A modal component that displays a live demo of the app.
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

import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import PropTypes from 'prop-types';

Layout.propTypes = {
    children: PropTypes.object.isRequired
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-white">
      <NavBar />
        <main className="p-4">{children}</main>
      <Footer />
    </div>
  );
}