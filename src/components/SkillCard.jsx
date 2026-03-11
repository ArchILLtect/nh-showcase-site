/**
 * File: SkillCard.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 11, 2026
 * Description: This is the component used for displaying individual projects cards on the projects page.
 *   It is a wrapper around the ProjectCardItem component that is used to display the project details.
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

const SkillCard = ({ skill, type, width }) => {

  let containerClassName;
  let imageClassName;

  if (type === "skill") {
    containerClassName = skill.flex
      ? "w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark justify-center content-center"
      : "w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark justify-center content-center";
  } else if (type === "process") {
    containerClassName = width + " h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark " +
        "justify-center content-center";
  } else {
    containerClassName = skill.flex
    ? "w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark justify-center content-center"
    : "w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark justify-center content-center";
  }

  if (type === "skill") {
    imageClassName = skill.flex
      ? "transition transform hover:scale-110"
      : "w-24 h-auto transition transform hover:scale-110";
  } else if (type === "process") {
    imageClassName = "h-24 transition transform hover:scale-110";
  } else {
    imageClassName = skill.flex
    ? "transition transform hover:scale-110"
    : "w-24 h-auto transition transform hover:scale-110";
  }

  return (
    <div className={containerClassName}>
      <img src={skill.icon} className={imageClassName} alt={skill.alt} title={skill.title} />
    </div>
  );
};

export default SkillCard;

SkillCard.propTypes = {
  skill: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    flex: PropTypes.bool,
  }).isRequired,
  type: PropTypes.string,
  width: PropTypes.string,
};