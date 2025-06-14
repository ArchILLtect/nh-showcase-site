import React, { useEffect } from 'react';
import { trackVisit } from "../utils/visitTracker";

const certs = [
  {
    title: "Interactivity with JavaScript and jQuery",
    issuer: "Coursera/UCDavis",
    date: "Sept 2023",
    image: "Interactivity_with_JSt&jQuery.png",
    certUrl: "https://coursera.org/share/1f5673fdbfac30d7904362588fc6bd74",
  },
  {
    title: "Data Manipulation in JavaScript",
    issuer: "Coursera/UCDavis",
    date: "Oct 2023",
    image: "Data_Manipulation_in_JS.png",
    certUrl: "https://coursera.org/share/fb2d3df796f87e45865954120015286c",
  },
  {
    title: "Introduction to VueJS Framework",
    issuer: "Coursera/Codio",
    date: "May 2024",
    image: "Introduction_to_VueJS_Framework.png",
    certUrl: "https://coursera.org/share/64755d94b9c8f788267aa79761dd6ec7",
  },
{
    title: "Animation with JavaScript and jQuery",
    issuer: "Coursera/UCDavis",
    date: "Sept 2023",
    image: "Animation_with_JS_and_jQuery.jpg",
    certUrl: "https://coursera.org/share/0272faccb45729db7ed29ccd6655864f",
  },
];

const Certificates = () => {

  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-gray-700 dark:text-gray-200 mb-10">
        Certifications
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {certs.map((cert, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between"
          >
            <img
              src={cert.image}
              alt={`${cert.title} badge`}
              className="h-32 object-contain mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
              {cert.title}
            </h2>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              {cert.issuer} · {cert.date}
            </p>
            <div className="flex justify-center mt-4">
              <a
                href="https://coursera.org/verify/XYZ123"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-center"
                >
                Verify Certificate
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;