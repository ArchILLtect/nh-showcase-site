/**
 * File: ProjectCardItem.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 11, 2026
 * Description: This is the component used for displaying individual projects in a project card
 *
 * Props:
 * - project: An object containing the project details, including:
 *   - title: The title of the project.
 *   - description: A brief description of the project.
 *   - techStack: An array of technologies used in the project.
 *   - image: A URL to an image representing the project.
 *   - liveDemo: A URL to a live demo of the project (optional).
 *   - siteLink: A URL to the live site of the project (optional).
 *   - github: A URL to the GitHub repository of the project (optional).
 *   - status: A string indicating the deployment status of the project (e.g., "In Development", "Deployed", "None").
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React from 'react';
import PropTypes from 'prop-types';
import AppModal from './AppModal';

const ProjectCardItem = ({ project }) => {


  if (project.status?.trim() !== "None") {

    return (
      <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300
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
    );
  } else {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300
            rounded-lg shadow-md dark:shadow-dark overflow-hidden opacity-50 cursor-not-allowed">
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
    );
  }

};

export default ProjectCardItem;

ProjectCardItem.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    techStack: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired,
    liveDemo: PropTypes.string,
    siteLink: PropTypes.string,
    github: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};