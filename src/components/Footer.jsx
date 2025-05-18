/**
 * File: Footer.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The footer component for the showcase site.
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
import DarkModeToggle from "./DarkModeToggle";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-gray-100 flex flex-col sm:flex-row text-center py-2
                fixed w-full bottom-0 justify-around items-center">
            <p>&copy; {currentYear} Nick Hanson Sr.</p>
            <DarkModeToggle />
        </footer>
    );
};

export default Footer;