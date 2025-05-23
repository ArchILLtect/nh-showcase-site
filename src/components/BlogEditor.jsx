/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: May 21, 2025
 * Last Updated: May 22, 2025
 * Description: A modal component that displays a live demo of the app.
 * 
 * Props:
 * - onSave: A function to handle saving the blog post.
 * 
 * Notes:
 * - Uses React hooks for state management.
 * - Uses the SimpleMDE library for a Markdown editor.
 * 
 * * Dependencies:
 * - React
 * - SimpleMDE: A simple Markdown editor.
 * - PropTypes: A library for type checking React props.
 * - useState: A React hook for managing state.
 * 
 */


import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import PropTypes from 'prop-types';

BlogEditor.propTypes = {
    onSave: PropTypes.func.isRequired
};

const BLOG_API_ENDPOINT = "https://0khffs67k4.execute-api.us-east-2.amazonaws.com/dev/";

export default function BlogEditor ({ onSave }) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [filename, setFilename] = useState("");

  const createdAt = new Date().toISOString();

  const handleSubmit = async () => {
    const newPost = {
      author,
      category,
      title,
      content,
      excerpt,
      createdAt,
      filename,
    };

    try {
      const response = await axios.post(BLOG_API_ENDPOINT, newPost);
      alert("Blog saved!");
      console.log("Saved:", response.data);

      // Optional: only run onSave if backend write succeeded
      onSave(newPost);

    } catch (err) {
      console.error("Lambda Error:", err);

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: JSON.stringify({
          message: "Failed to create post",
          errorMessage: err.message,
          errorStack: err.stack,
          errorDetails: err
        }),
      };
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h2 className="text-2xl mb-4">Create a New Blog Post</h2>
      <input
        name="category"
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        autoComplete="on"
      />
      <input
        name="author"
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        autoComplete="name"
      />
      <input
        name="title"
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        name="excerpt"
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Post Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <SimpleMDE value={content} onChange={setContent} />
      <input
        name="filename"
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Filename (e.g., post.md)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        autoComplete="off"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 mb-8 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Post
      </button>
    </div>
  );
}
