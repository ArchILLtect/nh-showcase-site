/**
 * File: FeaturedProjectCard.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 10, 2026
 * Description: This is the component used for displaying individual featured projects cards on the homepage
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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FeaturedProjectCard = ({ project }) => {
  return (
    <div className="bg-gray-800 dark:bg-gray-300 p-4 rounded shadow dark:shadow-dark">
      <img
        src={project.image}
        alt={`${project.title} thumbnail`}
        className="rounded w-full mb-4 text-gray-100 dark:text-gray-800 h-96 object-contain"
      />
      <h3 className="text-xl text-gray-100 dark:text-gray-800 font-bold mb-2">{project.title}</h3>
      <p className="text-gray-300 dark:text-gray-700">
        {project.description}
      </p>
      {project.projectPage && (
        <Link
          to={project.projectPage}
          className="mt-4 inline-flex min-h-11 items-center rounded px-1 font-semibold text-blue-300 dark:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Project Details
        </Link>
      )}
    </div>
  );
}

export default FeaturedProjectCard;

FeaturedProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    projectPage: PropTypes.string,
  }).isRequired,
};
