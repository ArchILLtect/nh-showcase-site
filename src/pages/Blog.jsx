/**
 * File: Blog.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The blog page for the showcase site.
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

import React, { useEffect, useState } from "react";



export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Example: Fetch projects from a local JSON file or API
    fetch('data/blogs.json')
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);
  
    const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      setSelectedPost(null); // Reset selected post when switching categories
    };
  
    const handlePostClick = (post) => {
      setSelectedPost(post);
    };
  
    const handleBackClick = () => {
      setSelectedPost(null);
    };
  
    // Filter blogs based on the selected category
    const filteredPosts =
      selectedCategory === "all"
        ? blogs
        : blogs.filter((post) => post.category === selectedCategory);
  
    return (
      <div className="blogs-page container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Nick's Blogs</h1>
        <div className="categories flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "work"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleCategoryClick("work")}
          >
            Work/Hobby
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "school"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleCategoryClick("school")}
          >
            School
          </button>
        </div>

        {!selectedPost ? (
          <div className="blog-list grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="blog-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <p className="text-sm text-gray-500">{post.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="blog-post bg-white rounded-lg shadow-md p-6">
            <button
              onClick={handleBackClick}
              className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
            >
              ← Back to Blogs
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedPost.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{selectedPost.date}</p>
            <p className="text-gray-700 leading-relaxed">{selectedPost.content}</p>
          </div>
        )}
      </div>
    );
  }