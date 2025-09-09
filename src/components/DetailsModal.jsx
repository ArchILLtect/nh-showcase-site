/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: September 08, 2025
 * Last Updated: September 08, 2025
 * Description: A modal component that displays badge details.
 *
 * Props:
 * - badge: The badge object to be displayed in the modal.
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

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

export default function DetailsModal({ isOpen, onClose, badge }) {
  if (!isOpen || !badge) return null;

  const closeBtnRef = useRef(null);

  // Prevent page scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Trap focus within the modal for accessibility
  useEffect(() => {
    const focusable = [...document.querySelectorAll('[data-modal] a, [data-modal] button, [data-modal] input, [data-modal] textarea, [data-modal] select, [data-modal] [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    const onKey = (e) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Allow Esc to close + focus the Close button for accessibility
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const {
    title,
    issuer,
    date,
    description,
    skills = [],
    image,
    badgeUrl,
    criteria
  } = badge || {};

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="badge-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose} // click backdrop to close
    >
      <div
        className="max-w-3xl w-[92%] sm:w-11/12 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 relative border-4 border-gray-300 dark:border-gray-600 max-h-[90vh] overflow-y-auto  animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close on content click
      >
        {/* Close (X) */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 rounded-full px-3 py-1 bg-red-600 text-white hover:bg-red-700"
        >
          X
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          {image ? (
            <img
              src={image}
              alt={`${title ?? "Badge"} image`}
              className="w-28 h-28 object-contain rounded-md bg-white"
            />
          ) : null}
          <div>
            <h2
              id="badge-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              {title || "Badge"}
            </h2>
            {(issuer || date) && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {issuer}
                {issuer && date ? " • " : ""}
                {date}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        {description && (
          <div className="mt-4 text-gray-800 dark:text-gray-200 leading-relaxed">
            {description}
          </div>
        )}

        {skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Skills
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <li
                  key={`${s}-${i}`}
                  className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {criteria?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Criteria
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
              {criteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <a
            href={badgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            Verify Badge
          </a>
          <button
            onClick={onClose}
            className="inline-block text-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

DetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  badge: PropTypes.object,
};