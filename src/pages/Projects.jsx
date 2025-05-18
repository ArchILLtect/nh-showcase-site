/**
 * File: Projects.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The projects page for the showcase site.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React, { useEffect, useState } from 'react';
import AppModal from '../components/AppModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Example: Fetch projects from a local JSON file or API
    fetch('data/projects.json')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto
        p-4 sm:p-8 mb-20">
      <h1 className="text-gray-600 dark:text-gray-100 text-4xl font-bold text-center mb-6">
        My Projects
      </h1>
      <p className="dark:text-gray-200 text-center text-gray-700 font-semibold mb-8">
        Here are some of the projects I’ve worked on, showcasing my skills in web development,
        problem-solving, and design.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map through the projects array and display each project */}
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
                <p className="dark:text-gray-300 text-gray-600 mb-4">
                  {project.description}
                </p>
                <p className="dark:text-gray-300 text-sm text-gray-500 font-semibold mb-4">
                  Tech Stack: {project.techStack.join(', ')}
                </p>
                <div className="flex space-x-4">
                  {project.liveDemo && (
                    <AppModal site={project.liveDemo } /> /* Pass liveDemo as site */
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
    </div>
  );
};

export default Projects;