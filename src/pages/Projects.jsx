/**
 * File: Projects.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: March 11, 2026
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
import { trackVisit } from "../utils/visitTracker";
import LoadingSpinner from '../components/LoadingSpinner';
import Video from '../components/Video';
import ProjectCard from '../components/ProjectCard';

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
        problem-solving, and design. All of these projects are built from the ground up by me
        and are still being developed, improved, and maintained.
      </p>
      <div className="mb-10">
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">Demos:</h2>
        {projectsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index}>
                <ProjectCard project={project} />
              </div>
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