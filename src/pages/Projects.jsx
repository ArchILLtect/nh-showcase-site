/**
 * File: Projects.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: July 25, 2025
 * Description: The projects page for the showcase site.
 * This is where the user can view projects.
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
 * - useState: A React hook for managing state.
 * - useEffect: A React hook for side effects.
 * - AppModal: A component to display a modal with a live demo of the app.
 * - trackVisit: A utility function to track visits to the projects page.
 * - LoadingSpinner: A component for display a spinner during loading times.

 */

import React, { useEffect, useState } from 'react';
import AppModal from '../components/AppModal';
import { trackVisit } from "../utils/visitTracker";
import LoadingSpinner from '../components/LoadingSpinner';
import Video from '../components/Video';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const start = Date.now();
      try {
        setProjectsLoading(true); // show spinner
        const response = await fetch('data/projects.json');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setProjectsLoading(false), delay); // ⏳ delay cleanup
      }
    };
    const loadVideos = async () => {
      const start = Date.now();
      try {
        setVideosLoading(true); // show spinner
        const response = await fetch('data/videos.json');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setVideosLoading(false), delay); // ⏳ delay cleanup
      }
    };

    loadProjects();
    loadVideos();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-sm md:max-w-2xl lg:max-w-5xl mx-auto
        p-4 sm:p-8 mb-40">
      <h1 className="text-gray-600 dark:text-gray-100 text-4xl font-bold text-center mb-6">
        My Projects
      </h1>
      <p className="dark:text-gray-200 text-center text-gray-700 font-semibold mb-8">
        Here are some of the projects I’ve worked on, showcasing my skills in web development,
        problem-solving, and design.
      </p>
      <div className="mb-10">
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">Demos:</h2>
        {projectsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Extract the following as a reusable component "<ProjectCard></ProjectCard>" */}
            {projects.map((project, index) => (
              project.status?.trim() !== "None" ? (
                <div key={index} className="bg-gray-200 dark:bg-gray-800 border border-gray-300
                    rounded-lg shadow-md dark:shadow-dark overflow-hidden hover:scale-110">
                  <img
                    src={project.image}
                    alt={`${project.title} thumbnail`}
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-4">
                    <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-2">
                      {project.title}
                    </h2>
                    <p className="dark:text-gray-300 text-gray-600 mb-4 h-24 overflow-y-auto scrollbar-custom p-0.5">
                      {project.description}
                    </p>
                    <p className="dark:text-gray-300 text-sm text-gray-500 font-semibold mb-4 h-12 overflow-y-auto scrollbar-custom">
                      Tech Stack: {project.techStack.join(', ')}
                    </p>
                    <div className="flex justify-between items-center">
                      {project.liveDemo && (
                        <AppModal site={project.liveDemo } /> /* Pass liveDemo as site */
                      )}
                      {project.siteLink && (
                        <div className="flex items-center">
                          <a
                            href={project.siteLink}
                            className="dark:text-green-300 text-green-700 text-2xl hover:underline font-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Site
                          </a>
                        </div>
                      )}
                      {!project.siteLink && !project.liveDemo && (
                        <div className="flex items-center">
                          <p className="dark:text-red-500 text-red-700">
                            No Live Demo Available Yet
                          </p>
                        </div>
                      )}
                      {project.github && (
                        <div className="flex items-center">
                          <a
                            href={project.github}
                            className="dark:text-blue-300 text-blue-700 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </a>
                        </div>
                      )}
                    </div>
                    {project.status && (
                      <div className="flex items-center p-2 mt-3 justify-center
                          bg-yellow-100 dark:bg-yellow-800 rounded">
                        <p className="dark:text-yellow-300 text-yellow-700 font-semibold">
                          {project.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
              <div key={index} className="bg-gray-200 dark:bg-gray-800 border border-gray-300
                  rounded-lg shadow-md dark:shadow-dark overflow-hidden opacity-50">
                  <img
                    src={project.image}
                    alt={`${project.title} thumbnail`}
                    className="w-full h-48 object-contain"
                  />
                <div className="p-4">
                  <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-2">
                    {project.title}
                  </h2>
                  <p className="dark:text-gray-300 text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <p className="dark:text-gray-300 text-sm text-gray-500 mb-4">
                    Tech Stack: {project.techStack.join(', ')}
                  </p>
                  <div className="flex space-x-4">
                    <p className="text-gray-700 dark:text-red-500">
                      Project Not Yet Deployed
                    </p>
                  </div>
                </div>
              </div>
              )
            ))}
          </div>
        )}
      </div>
      <hr />
      <div>
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold my-4">Videos:</h2>
        {videosLoading ? (
          <LoadingSpinner />
        ) : (
          videos.map((video, index) => (
            <Video key={index} video={video} />
          ))
        )}
      </div>
      <hr />
    </div>
  );
};

export default Projects;