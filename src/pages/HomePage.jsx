/**
 * File: HomePage.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: July 17, 2025
 * Description: The homepage for the showcase site.
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

// TODO: Add cookies or at least data gathering disclosure.

import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import { trackVisit } from "../utils/visitTracker";
import FeaturedProjects from '../components/FeaturedProjects';
import SkillSection from '../components/SkillSection';

const HomePage = () => {

  useEffect(() => {
    document.title = "Home - Nick Hanson Showcase";
    document.body.classList.add('bg-gray-200');
     // Add the dark mode class to the body when the component mounts
    document.body.classList.add('dark:bg-gray-900');
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <main className="dark:bg-gray-600 text-gray-100 pt-5 w-full mx-auto sm:max-w-lg md:max-w-2xl
        lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl">
      {/* Hero Section */}
      <section className="relative lg:max-w-4xl text-center py-20 bg-gray-100 dark:bg-gray-800
          bg-hero-pattern bg-center bg-auto m-auto">
        <div className="absolute inset-0 bg-gray-800 bg-opacity-85"></div>
        <h1 className="relative z-10 text-4xl font-mono font-bold mb-4">
          <span className="text-blue-600">
            &lt;Hello World /&gt;
          </span> My name is Nick.
        </h1>
        <p className="relative z-10 text-lg mb-6 text-gray-200">
          This is where I showcase my projects, share my blogs, and more.
        </p>
        <Link to="/projects" className="flex justify-center mt-6">
          <button className="relative z-10 px-6 py-3 bg-blue-500 text-gray-100 text-sm rounded
              hover:bg-blue-600 transition duration-500">
            Explore My Projects
          </button>
        </Link>
      </section>

      {/* Skills Section */}
      {/* TODO: Add C#, C++ and .NET */}
      <section className="py-12">
        <SkillSection />
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 justify-items-center">
        <FeaturedProjects />
      </section>

      {/* Bio Section */}
      <section className="pt-8 pb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          About Me
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 p-5 items-center justify-center">
          <img
            src="images/Profile-pic.jpg"
            alt="Profile"
            className="rounded-full w-24 h-24 shadow"
          />
          <p className="text-gray-700 dark:text-gray-300 max-w-lg sm:text-left max-w-xl font-semibold">
            Hi, I’m <b>Nick Hanson Sr.</b>, a passionate web developer. I <u>love</u> building
            intuitive, accessible, and visually appealing applications. When I’m
            not coding, I enjoy exploring new technologies and sharing my
            knowledge with others.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;