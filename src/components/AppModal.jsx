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
            <div className="bg-white w-11/12 h-5/6 rounded-lg shadow-lg relative overflow-hidden p-4">
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
    site: PropTypes.object.isRequired
};

export default AppModal;