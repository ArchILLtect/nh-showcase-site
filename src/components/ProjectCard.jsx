/**
 * File: ProjectCard.jsx
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
import ProjectCardItem from './ProjectCardItem';

const ProjectCard = ({ project }) => {

  return (
    <ProjectCardItem project={project} />
  );
};

export default ProjectCard;

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    techStack: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired,
    liveDemo: PropTypes.string,
    siteLink: PropTypes.string,
    projectPage: PropTypes.string,
    github: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};
