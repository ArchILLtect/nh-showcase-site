import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import PropTypes from 'prop-types';

Layout.propTypes = {
    children: PropTypes.object.isRequired
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
        <main className="p-4">{children}</main>
      <Footer />
    </div>
  );
}