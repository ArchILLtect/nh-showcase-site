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

const FeaturedProjectCard = ({ project }) => {

  return (
    <div className="bg-gray-800 h- dark:bg-gray-300 p-4 rounded shadow dark:shadow-dark hover:scale-105">
      <img
        src={project.image}
        alt={`${project.title} thumbnail`}
        className="rounded w-full mb-4 text-gray-100 dark:text-gray-800 h-96 object-contain"
      />
      <h3 className="text-xl text-gray-100 dark:text-gray-800 font-bold mb-2">{project.title}</h3>
      <p className="text-gray-300 dark:text-gray-700">
        {project.description}
      </p>
    </div>
  );
}

export default FeaturedProjectCard;

FeaturedProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};