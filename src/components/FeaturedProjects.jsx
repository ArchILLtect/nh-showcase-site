/**
 * File: FeaturedProjects.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 10, 2026
 * Description: This is the component used for displaying the featured projects section on the homepage
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
import FeaturedProjectCard from './FeaturedProjectCard';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProjects = () => {
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

  // Keep explicitly featured projects visible, then fill any remaining slots from active projects.
  const prepFeaturedProjects = (projects) => {
    if (projects.length === 0) return; // ⏳ wait for projects to load

    // Prefer explicitly featured projects when present; otherwise fallback to active projects.
    const explicitlyFeatured = projects.filter((project) => project.featured === true);
    const fallbackPool = projects.filter(
      (project) => project.status?.trim() !== "None" && project.featured !== true
    );
    const shuffledFallback = [...fallbackPool].sort(() => 0.5 - Math.random());

    setFeaturedProjects([...explicitlyFeatured, ...shuffledFallback].slice(0, 2));
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
            <FeaturedProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}

      <Link
        to="/projects"
        className="mx-auto mt-6 flex min-h-11 w-fit items-center justify-center rounded bg-blue-500 px-6 py-3 text-sm text-white transition duration-500 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        View All Projects
      </Link>
    </div>
  );
};

export default FeaturedProjects;
