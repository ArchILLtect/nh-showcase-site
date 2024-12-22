import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white text-center py-2 fixed w-full bottom-0">
            <p>&copy; {currentYear} Nick Hanson Sr.</p>
        </footer>
    );
};

export default Footer;