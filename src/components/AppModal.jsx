/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: A modal component that displays a live demo of the app.
 * 
 * Props:
 * - site: The URL of the site to be displayed in the modal.
 * 
 * Notes:
 * - Uses React Portal to render the modal outside of the main DOM hierarchy.
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 * 
 * Dependencies:
 * - React
 * - PropTypes: A library for type checking React props.
 * - createPortal: A React function for rendering children into a DOM node
 *   outside of the parent component's DOM hierarchy.
 * - useState: A React hook for managing state.
 *  
 * 
 */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from 'prop-types';

const AppModal = ({ site }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <>
      {/* Live Demo Button */}
      <button
        onClick={toggleModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold border border-gray-300
          dark:border-gray-600 shadow-md py-2 px-4 rounded"
      >
        Live Demo
      </button>

      {/* Modal using React Portal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 h-5/6 rounded-lg shadow-lg relative overflow-hidden p-4 max-w-screen-xl">
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold
                    px-3 py-1 rounded-full"
              >
                X
              </button>

              {/* Embedded App */}
              <iframe
                src={site}
                title="Live Demo"
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </div>,
          document.body // Mounts modal directly under the <body> tag
        )}
    </>
  );
};

AppModal.propTypes = {
    site: PropTypes.node.isRequired
};

export default AppModal;