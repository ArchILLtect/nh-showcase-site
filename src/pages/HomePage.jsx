import React, {useEffect} from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = "Home - My Website";
  }, []);

  return (
    <div>
      <main className="text-center p-5">
        <section>
          <h1 className="text-2xl font-bold my-5" id="welcomeMessage">Welcome to My Personal Site</h1>
          <p className="my-5">This is where I showcase my projects, share my resume, and more.</p>
          <button className="px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer" id="logoutButton">Logout</button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;