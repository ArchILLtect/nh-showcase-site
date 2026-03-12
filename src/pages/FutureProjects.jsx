/**
 * File: FutureProjects.jsx
 * Author: Nick Hanson
 * Created On: March 11, 2026
 * Last Updated: March 11, 2026
 * Description: The future projects page for the showcase site.
 * This is where the user can view upcoming projects.
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
 * - trackVisit: A utility function to track visits to the future projects page.
 * - LoadingSpinner: A component for display a spinner during loading times.
 */

import React, { useEffect, useState } from 'react';
import { trackVisit } from "../utils/visitTracker";
import { usePageTitle } from '../hooks/usePageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';

const FutureProjects = () => {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  usePageTitle('Future Projects');

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const start = Date.now();
      try {
        setProjectsLoading(true); // show spinner
        const response = await fetch('data/futureProjects.json');
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
    loadProjects();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-sm md:max-w-2xl lg:max-w-5xl mx-auto
        p-4 sm:p-8 mb-40">
      <h1 className="text-gray-600 dark:text-gray-100 text-4xl font-bold text-center mb-6">
        Future Projects
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
    </div>
  );
};

export default FutureProjects;