import React from "react";
import DarkModeToggle from "./DarkModeToggle";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white text-center py-2 fixed w-full bottom-0 flex justify-around items-center">
            <p>&copy; {currentYear} Nick Hanson Sr.</p>
            <DarkModeToggle />
        </footer>
    );
};

export default Footer;