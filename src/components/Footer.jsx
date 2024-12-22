import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white text-center py-2 fixed w-full bottom-0 flex justify-around items-center">
            <p>&copy; {currentYear} Nick Hanson Sr.</p>
            <button
                onClick={() => document.documentElement.classList.toggle("dark")}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded"
            >
            Toggle Dark Mode
            </button>
        </footer>
    );
};

export default Footer;