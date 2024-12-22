import React, {useEffect} from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = "Home - Nick Hanson Showcase";
  }, []);

  return (
    <main className="p-4">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Personal Site</h1>
        <p className="text-lg text-gray-700 mb-6">
          This is where I showcase my projects, share my resume, and more.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          Explore My Projects
        </button>
      </section>

      {/* Skills Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-6">My Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="text-center bg-gray-100 p-4 rounded shadow">
            <p>HTML</p>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded shadow">
            <p>CSS</p>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded shadow">
            <p>JavaScript</p>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded shadow">
            <p>React</p>
          </div>
          {/* Add more skills as needed */}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
        <p className="text-center text-gray-700 mb-6">
          Here’s a glimpse of what I’ve been working on.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          View All Projects
        </button>
      </section>

      {/* Bio Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-6">About Me</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-full w-32 h-32 shadow"
          />
          <p className="text-gray-700 max-w-lg text-center sm:text-left">
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