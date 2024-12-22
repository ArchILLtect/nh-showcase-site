import React, {useEffect} from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = "Home - Nick Hanson Showcase";
  }, []);

  return (
    <main className="p-4 w-5/6 mx-auto dark:bg-gray-600 dark:text-white">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gray-100 dark:bg-gray-800 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Personal Site</h1>
        <p className="text-lg text-gray-700 mb-6 dark:text-gray-300">
          This is where I showcase my projects, share my resume, and more.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-500">
          Explore My Projects
        </button>
      </section>

      {/* Skills Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-6">My Skills</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="HTML-CSS-JS-Icon.png" className="w-24 h-auto transition transform hover:scale-110" alt="HTML/CSS/JS Icon"/>
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="React-logo.png" className="transition transform hover:scale-110" alt="React Logo"/>
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="Tailwind-icon.png" className="transition transform hover:scale-110" alt="Tailwind Logo"/>
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="Angular-icon.png" className="transition transform hover:scale-110" alt="Angular Logo"/>
          </div>
          <div className="w-32 h-32 flex text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="PHP-Logo.png" className="transition transform hover:scale-110" alt="PHP Logo"/>
          </div>
          <div className="w-32 h-32 text-center bg-gray-100 p-4 rounded shadow justify-center content-center">
            <img src="Node.js-logo.png" className="w-24 h-12 transition transform hover:scale-110" alt="Node.js Logo"/>
          </div>
          {/* Add more skills as needed */}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Here’s a glimpse of what I’ve been working on.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-500">
          View All Projects
        </button>
      </section>

      {/* Bio Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-6">About Me</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-10">
          <img
            src="Profile-pic.jpg"
            alt="Profile"
            className="rounded-full w-24 h-24 shadow"
          />
          <p className="text-gray-700 dark:text-gray-300 max-w-lg text-center sm:text-left">
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