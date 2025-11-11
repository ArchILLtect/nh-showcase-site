/**
 * File: Certificates.jsx
 * Author: Nick Hanson
 * Created On: June 13, 2025
 * Last Updated: June 13, 2025
 * Description: The certificate page for the showcase site.
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React, { useEffect, useState } from 'react';
import { trackVisit } from "../utils/visitTracker";
import LoadingSpinner from '../components/LoadingSpinner';
import DetailsModal from '../components/DetailsModal';

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const loadCertificates = async () => {
      const start = Date.now();
      try {
        setLoadingCerts(true); // show spinner
        const response = await fetch('/data/certificates.json');
        const data = await response.json();
        setCerts(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setLoadingCerts(false), delay); // ⏳ delay cleanup
      }
    };
    const loadBadges = async () => {
      const start = Date.now();
      try {
        setLoadingBadges(true); // show spinner
        const response = await fetch('/data/badges.json');
        const data = await response.json();
        setBadges(data);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setLoadingBadges(false), delay); // ⏳ delay cleanup
      }
    };

    loadCertificates();
    loadBadges();
  }, []);

  return (
    <div className="bg-gray-200 dark:bg-gray-600 xl:max-w-6xl lg:max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-700 dark:text-gray-200 my-6">
        Certifications
      </h1>
      {loadingCerts ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-6 border-2 border-gray-700 dark:border-gray-700 p-8 rounded-lg">
          {certs.map((cert, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between"
            >
              <img
                src={cert.image}
                alt={`${cert.title} badge`}
                className="h-32 object-contain mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                {cert.title}
              </h2>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                {cert.issuer} · {cert.date}
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href={cert.certUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-center"
                  >
                  Verify Certificate
                  </a>
              </div>
            </div>
          ))}
        </div>
      )}
      <h1 className="text-4xl font-bold text-center text-gray-700 dark:text-gray-200 mb-6">
        Badges
      </h1>
      {loadingBadges ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-6 border-2 border-gray-300 dark:border-gray-700 p-8 rounded-lg">
          {badges.map((badge, idx) => (
            // TODO: Switch to modal for full info with current info as is, and then verify link in modal.
            <div
              key={idx}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between"
            >
              <img
                src={badge.image}
                alt={`${badge.title} badge`}
                className="h-32 object-contain mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                {badge.title}
              </h2>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                {badge.issuer} · {badge.date}
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    setSelectedBadge(badge);
                    setIsBadgeModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-center"
                >
                  Badge Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h1 className="text-4xl font-bold text-center text-gray-700 dark:text-gray-200 mb-6">
        Professional Development
      </h1>
      {/* TODO: Change this to "loadingVideos" check
        and fetch video data from videos JSON like certs/badges
        using the Videos component to render each video
      */}
      {loadingBadges ? (
        <LoadingSpinner />
      ) : (
        <div className="mb-20 ml-3 border-2 border-gray-300 dark:border-gray-700 p-8 rounded-lg">
          <p className="dark:text-gray-200 text-gray-700 font-semibold text-lg mb-4">Project Lombok:</p>
          <div className="mb-4">
            <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">Description:</p>
            <p className="dark:text-gray-200 text-gray-700 text-sm mb-2">This full presentation explores how Project Lombok can drastically simplify Java development by reducing boilerplate code and improving readability — all without sacrificing functionality.</p>
            <p className="dark:text-gray-200 text-gray-700 text-sm">I take you through a real-world example from my CodeForge project, where I integrated Lombok into an existing entity class and immediately saw the benefits:</p>
            <ul className="list-disc list-inside">
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">120 lines of repetitive getters, setters, and constructors reduced to just 49.</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Clearer, more maintainable code.</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">A few spicy bugs along the way (and what they taught me about Hibernate and reflection).</li>
            </ul>
          </div>
          <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">We&apos;ll look at:</p>
          <div className="mb-4">
            <ol className="list-decimal list-inside mb-4">
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">What Lombok is and how it works behind the scenes (compile-time annotation magic).</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">How to integrate it cleanly using Maven.</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">The before-and-after refactor of the Challenge class.</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Results, debugging, and lessons learned.</li>
              <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Reflections on professional growth — from code cleanup to clear communication.</li>
            </ol>
            <p className="dark:text-gray-200 text-gray-700 text-sm">Throughout the talk, I blend humor with practical insights — proving that writing clean Java code doesn’t have to be boring. 🌶️</p>
          </div>
          <div className="flex flex-col">
            <p className="dark:text-gray-200 text-gray-700 text-sm">YouTube video<a className="text-blue-500 hover:underline ml-4" href="https://youtu.be/iCxZS0Pwx80" target="_blank" rel="noopener noreferrer">Part 1</a></p>
            <p className="dark:text-gray-200 text-gray-700 text-sm">YouTube video<a className="text-blue-500 hover:underline ml-4" href="https://youtu.be/JoKJuyTOpwk" target="_blank" rel="noopener noreferrer">Part 2</a></p>
          </div>
        </div>
      )}
      {/* Modal */}
      {isBadgeModalOpen && (
        <DetailsModal
          isOpen
          onClose={() => setIsBadgeModalOpen(false)}
          badge={selectedBadge}
        />
      )}
    </div>
  );
};

export default Certificates;