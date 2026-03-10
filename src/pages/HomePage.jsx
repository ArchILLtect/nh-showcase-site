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
import FeaturedProjectCard from '../components/FeaturedProjectCard';

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
        <h2 id="skills" className="text-2xl font-bold text-center text-gray-300 dark:text-gray-200 mb-6">
          My Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
            2xl:grid-cols-7 gap-x-2 gap-y-8 justify-items-center">
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/HTML-CSS-JS-Icon.png" className="w-24 h-auto transition transform
                hover:scale-110" alt="HTML/CSS/JS Icon" title="HTML/CSS/JavaScript" />
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow
              dark:shadow-dark justify-center content-center">
            <img src="icons/React-logo.png" className="transition transform hover:scale-110"
                alt="React Logo" title="React" />
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow
              dark:shadow-dark justify-center content-center">
            <img src="icons/Tailwind-icon.png" className="transition transform hover:scale-110"
                alt="Tailwind Logo" title="Tailwind CSS" />
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow
              dark:shadow-dark justify-center content-center">
            <img src="icons/Angular-icon.png" className="transition transform hover:scale-110"
                alt="Angular Logo" title="Angular" />
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow
              dark:shadow-dark justify-center content-center">
            <img src="icons/PHP-Logo.png" className="transition transform hover:scale-110"
                alt="PHP Logo" title="PHP" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/Node.js-logo.png" className="w-24 h-12 transition
                transform hover:scale-110" alt="Node.js Logo" title="Node.js" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/java-icon.webp" className="w-24 h-24 transition
                transform hover:scale-110" alt="Java Logo" title="Java" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/Python-Logo.png" className="w-24 h-24 transition
                transform hover:scale-110" alt="Python Logo" title="Python" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/AWS-Web-Services-Logo.webp" className="w-24 h-24 transition
                transform hover:scale-110" alt="AWS Logo" title="Amazon Web Services" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/VSCode-Logo.jpg" className="w-24 h-24 transition
                transform hover:scale-110" alt="VS Code Logo" title="VS Code" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/MySQL-Logo.webp" className="w-24 h-24 transition
                transform hover:scale-110" alt="MySQL Logo" title="MySQL Database" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/DynamoDB-Logo.png" className="w-24 h-24 transition
                transform hover:scale-110" alt="DynamoDB Logo" title="Dynamo Database" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/MongoDb-Logo.png" className="w-24 h-24 transition
                transform hover:scale-110" alt="MongoDB Logo" title="Mongo Database" />
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/ChakraUI-Logo.png" className="w-24 h-24 transition
                transform hover:scale-110" alt="Chakra UI Logo" title="Chakra UI" />
          </div>
          {/* Add more skills as needed */}
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-300 dark:text-gray-200 mt-10 mb-6">
          My Process
        </h2>
        <div className="flex justify-around flex-wrap gap-6">
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/Figma-Logo.png" className="h-24 transition
                transform hover:scale-110" alt="Figma Logo" title="Figma" />
          </div>
          <div className="w-44 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/AGILE.png" className="h-24 transition
                transform hover:scale-110" alt="AWS Logo" title="AGILE Development Practices" />
          </div>
          <div className="w-56 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/Dev-Ops-Logo.png" className="h-24 transition
                transform hover:scale-110" alt="AWS Logo" title="Development Operations" />
          </div>
          <div className="w-36 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/CI-CD-Logo.png" className="h-24 transition
                transform hover:scale-110" alt="AWS Logo"
                title="CI/CD Pipeline - Continuous Integration & Deployment" />
          </div>
          <div className="w-40 h-32 text-center bg-gray-100 p-4 rounded shadow dark:shadow-dark
              justify-center content-center">
            <img src="icons/Git&GitHub-Logo.png" className="h-24 transition
                transform hover:scale-110" alt="AWS Logo" title="Git & Github" />
          </div>
          {/* Add more workflow/processes as needed */}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 justify-items-center">
        <FeaturedProjectCard />
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
          <p className="text-gray-700 dark:text-gray-300 max-w-lg sm:text-left max-w-xl">
            Hi, I’m Nick Hanson Sr., a passionate web developer. I love building
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