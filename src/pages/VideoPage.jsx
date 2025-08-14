import React, { useEffect } from "react";
import { trackVisit } from "../utils/visitTracker";

const VideoPage = () => {
  useEffect(() => {
    trackVisit();
    document.title = "Temporary Video";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Temporary Video Page
      </h1>

      <div className="w-full max-w-3xl aspect-video">
        <video controls className="w-full max-w-3xl rounded shadow-lg">
            <source src="./video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mt-4">
        This page will be removed after the video is no longer needed.
      </p>
    </div>
  );
};

export default VideoPage;