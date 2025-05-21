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
import BlogPost from "../components/BlogPost";

const BLOG_API_ENDPOINT = "https://0khffs67k4.execute-api.us-east-2.amazonaws.com/dev/";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch blogs from JSON file
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(BLOG_API_ENDPOINT);
        const data = await response.json();
        console.log("Fetched metadata:", data); // 👈 sanity check

        // Safe fallback to array
        const blogArray = Array.isArray(data)
          ? data
          : Array.isArray(data.Items)
            ? data.Items
            : [];

        setBlogs(blogArray);

        const uniqueCategories = ["all", ...new Set(blogArray.map((blog) => blog.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch blog metadata:", err);
        setBlogs([]); // fallback to empty array
      }
    };

    fetchMetadata();
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
    <div className="blogs-page container mx-auto px-4 py-8 mb-20">
      <h1 className="text-gray-700 dark:text-gray-200 text-4xl font-bold text-center mb-8">Nick&apos;s Blogs</h1>

      {/* Dynamic Category Buttons */}
      <div className="categories flex justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-900 bg-gray-200 font-semibold hover:bg-gray-300"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog List or Post View */}
      {!selectedPost ? (
        <div className="bg-gray-100 dark:bg-gray-600 mb-20 blog-list grid gap-6 md:grid-cols-2
            lg:grid-cols-3 p-5">
          {filteredBlogs.map((post) => (
            <div
              key={post.postId}
              className="bg-gray-200 dark:bg-gray-800 blog-card rounded-lg shadow-md
                  dark:shadow-dark p-6 hover:shadow-lg dark:hover:shadow-darklg transition-shadow
                  cursor-pointer hover:scale-105"
              onClick={() => handlePostClick(post)}
            >
              <h2 className="text-2xl text-gray-900 dark:text-gray-200 font-semibold mb-2">{post.title}</h2>
              <hr className="my-4 border-gray-500"/>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{post.createdAt}</p>
            </div>
          ))}
        </div>
      ) : (

        <BlogPost post={selectedPost} onBack={handleBackClick} />

      )}
    </div>
  );
}