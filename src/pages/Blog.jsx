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
 * 
 * // TODO: Decide what to do when there are > 9 categories.
 */

import React, { useState, useEffect } from "react";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch blogs from JSON file
  useEffect(() => {
    fetch("/data/blogs.json")
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);

        // Extract unique categories and include "all"
        const uniqueCategories = ["all", ...new Set(data.map((blog) => blog.category))];
        setCategories(uniqueCategories);
      });
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
  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  return (
    <div className="blogs-page container mx-auto px-4 py-8">
      <h1 className="dark:text-gray-100 text-4xl font-bold text-center mb-8">Nick's Blogs</h1>

      {/* Dynamic Category Buttons */}
      <div className="categories flex justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog List or Post View */}
      {!selectedPost ? (
        <div className="bg-gray-100 dark:bg-gray-600 mb-20 blog-list grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-5">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-gray-200 dark:bg-gray-800 blog-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-110"
              onClick={() => handlePostClick(post)}
            >
              <h2 className="text-2xl dark:text-gray-200 font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{post.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-600 p-5">
            <div className="bg-gray-200 dark:bg-gray-800 blog-post bg-white rounded-lg shadow-md p-6">
            <button
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
            >
                ← Back to Blogs
            </button>
            <h2 className="text-3xl font-bold mb-4 dark:text-gray-200">{selectedPost.title}</h2>
            <p className="text-sm text-gray-500 mb-6 dark:text-gray-300">{selectedPost.date}</p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-400">{selectedPost.content}</p>
            </div>
        </div>
      )}
    </div>
  );
}