/**
 * File: FeaturedProjectCard.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 10, 2026
 * Description: This is the component used for displaying the featured projects on the homepage
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

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import FeaturedProjectItem from './FeaturedProjectItem';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProjectCard = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const start = Date.now();
      try {
        setProjectsLoading(true); // show spinner
        const response = await fetch('data/projects.json');
        const data = await response.json();
        prepFeaturedProjects(data);
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

  // This function is used to set the featured projects on the homepage. It takes in a project object and sets the state of the featured projects to 2 random projects from the projects.json file. It also ensures that the same project is not featured twice.
  const prepFeaturedProjects = (projects) => {
    if (projects.length === 0) return; // ⏳ wait for projects to load

    // Prefer explicitly featured projects when present; otherwise fallback to active projects.
    const explicitlyFeatured = projects.filter((project) => project.featured === true);
    const fallbackPool = projects.filter((project) => project.status?.trim() !== "None");
    const pool = explicitlyFeatured.length > 0 ? explicitlyFeatured : fallbackPool;

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setFeaturedProjects(shuffled.slice(0, 2));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        Featured Projects
      </h2>

      {projectsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
          {featuredProjects.map((project) => (
            <FeaturedProjectItem key={project.title} project={project} />
          ))}
        </div>
      )}

      <Link to="/projects" className="flex justify-center mt-6">
        <button className="px-6 py-3 bg-blue-500 text-white text-sm rounded
            hover:bg-blue-600 transition duration-500">
          View All Projects
        </button>
      </Link>
    </div>
  );
};

export default FeaturedProjectCard;