/**
 * File: AboutMe.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The about me page for the showcase site.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React, { useState } from 'react';

const AboutMe = () => {
  const sections = [
    {
      title: "Introduction",
      summary: "Hi, I’m Nick Hanson, a former project manager with 15 years of experience, now transitioning into web development to turn my passion for coding into a career.",
      details: "I’ve always been fascinated by technology and problem-solving. After a fulfilling career in project management, I decided to pursue my passion for coding, creating web applications, and designing user-friendly solutions. I enjoy learning and constantly challenging myself with new projects.",
    },
    {
      title: "Education",
      summary: "Currently pursuing an Associate’s Degree in Web Software Development at Madison College, with plans to transfer for a BS in Computer Science.",
      details: "In addition to my degree, I’ve completed numerous online courses covering topics such as Python programming, JavaScript frameworks, and web accessibility. I’ve achieved high grades in my classes, including over 100% in advanced programming courses.",
    },
    {
      title: "Career Pivot",
      summary: "As a project manager, I developed skills in leadership, problem-solving, and technical communication, which I now apply to web development.",
      details: "In my project management career, I led diverse teams, managed tight deadlines, and facilitated communication between stakeholders. These skills have been invaluable in web development projects, where I prioritize clarity, efficiency, and teamwork.",
    },
    {
      title: "Ongoing Learning",
      summary: "I’m continuously learning through online courses like Python programming and staying ahead with the latest in web technologies.",
      details: "I’ve taken courses from platforms like Coursera and Codecademy, covering areas such as backend development, responsive design, and cloud technologies. I also plan to earn certifications in AWS and advanced Java programming.",
    },
  ];

  const [expanded, setExpanded] = useState(null);

  const toggleSection = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-600 xl:max-w-6xl lg:max-w-4xl mx-auto p-4">
      <h1 className="dark:text-gray-100 text-4xl font-bold text-center mb-6">About Me</h1>
      {sections.map((section, index) => (
        <div key={index} className="dark:bg-gray-300 mb-4 border-b border-gray-300 dark:border-gray-800">
          <button
            className="w-full text-left py-2 px-4 font-semibold text-lg flex justify-between items-center"
            onClick={() => toggleSection(index)}
          >
            {section.title}
            <span className="text-gray-500 dark:text-gray-800">
              {expanded === index ? "▲" : "▼"}
            </span>
          </button>
          <p className="px-4 py-2 text-gray-700 hover:text-lg">{section.summary}</p>
          {expanded === index && (
            <div className="px-4 pb-4 text-gray-600 hover:text-lg">
              {section.details}
            </div>
          )}
        </div>
      ))}
      <div className="mt-24 pb-24 flex flex-col text-center content-center flex-wrap hover:scale-110">
        <h2 className="dark:text-gray-100 text-3xl font-bold">Powered By:</h2>
        <img src="/images/NH-Circuit-Logo.webp" width="30%" alt="Nick Hanson Circuit Logo" />
      </div>
    </div>
  );
};

export default AboutMe;