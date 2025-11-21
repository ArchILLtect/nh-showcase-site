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
import Video from '../components/Video';

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
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
    const loadVideos = async () => {
      const start = Date.now();
      try {
        setLoadingVideos(true); // show spinner
        const response = await fetch('data/videos.json');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setLoadingVideos(false), delay); // ⏳ delay cleanup
      }
    };

    loadCertificates();
    loadBadges();
    loadVideos();
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
      {loadingVideos ? (
        <LoadingSpinner />
      ) : (
          videos.map((video, index) => (
            <Video key={index} video={video} />
          ))
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