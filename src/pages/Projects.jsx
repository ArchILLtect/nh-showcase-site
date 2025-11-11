/**
 * File: Projects.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: July 25, 2025
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
import AppModal from '../components/AppModal';
import { trackVisit } from "../utils/visitTracker";
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const start = Date.now();
      try {
        setLoading(true); // show spinner
        const response = await fetch('data/projects.json');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setLoading(false), delay); // ⏳ delay cleanup
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-sm md:max-w-2xl lg:max-w-5xl mx-auto
        p-4 sm:p-8 mb-20">
      <h1 className="text-gray-600 dark:text-gray-100 text-4xl font-bold text-center mb-6">
        My Projects
      </h1>
      <p className="dark:text-gray-200 text-center text-gray-700 font-semibold mb-8">
        Here are some of the projects I’ve worked on, showcasing my skills in web development,
        problem-solving, and design.
      </p>
      <div>
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">Videos:</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mb-6 ml-3 border-2 border-gray-400 p-4 rounded">
            <p className="dark:text-gray-200 text-gray-700 font-semibold text-lg mb-4">Project Lombok:</p>
            <div className="mb-4">
              <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">Description:</p>
              <p className="dark:text-gray-200 text-gray-700 text-sm mb-2">This full presentation explores how Project Lombok can drastically simplify Java development by reducing boilerplate code and improving readability — all without sacrificing functionality.</p>
              <p className="dark:text-gray-200 text-gray-700 text-sm">I take you through a real-world example from my CodeForge project, where I integrated Lombok into an existing entity class and immediately saw the benefits:</p>
              <ul className="list-disc list-inside">
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">120 lines of repetitive getters, setters, and constructors reduced to just 49.</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Clearer, more maintainable code.</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">A few spicy bugs along the way (and what they taught me about Hibernate and reflection).</li>
              </ul>
            </div>
            <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">We&apos;ll look at:</p>
            <div className="mb-4">
              <ol className="list-decimal list-inside mb-4">
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">What Lombok is and how it works behind the scenes (compile-time annotation magic).</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">How to integrate it cleanly using Maven.</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">The before-and-after refactor of the Challenge class.</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Results, debugging, and lessons learned.</li>
                <li className="dark:text-gray-200 text-gray-700 text-sm ml-3">Reflections on professional growth — from code cleanup to clear communication.</li>
              </ol>
              <p className="dark:text-gray-200 text-gray-700 text-sm">Throughout the talk, I blend humor with practical insights — proving that writing clean Java code doesn’t have to be boring. 🌶️</p>
            </div>
            <div className="flex flex-col">
              <p className="dark:text-gray-200 text-gray-700 text-sm">YouTube video<a className="text-blue-500 hover:underline ml-4" href="https://youtu.be/iCxZS0Pwx80" target="_blank" rel="noopener noreferrer">Part 1</a></p>
              <p className="dark:text-gray-200 text-gray-700 text-sm">YouTube video<a className="text-blue-500 hover:underline ml-4" href="https://youtu.be/JoKJuyTOpwk" target="_blank" rel="noopener noreferrer">Part 2</a></p>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">Demos:</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
      )}
      </div>
    </div>
  );
};

export default Projects;