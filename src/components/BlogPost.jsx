/**
 * File: AppModal.jsx
 * Author: Nick Hanson
 * Created On: May 21, 2025
 * Last Updated: May 22, 2025
 * Description: A modal component that displays a live demo of the app.
 * 
 * Props:
 * - post: The blog post object containing the title, date, and content.
 * - onBack: A function to handle going back to the blog list.
 * 
 * Notes:
 * - Uses React Hooks for state management.
 * - Uses React Markdown to render the blog post content.
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 * 
 * Dependencies:
 * - React
 * - React Markdown: A library for rendering Markdown content in React.
 * - Remark GFM: A plugin for GitHub Flavored Markdown support.
 * - PropTypes: A library for type checking React props.
 * - useState: A React hook for managing state.
 * - useEffect: A React hook for side effects.
 * 
 */

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from 'prop-types';

// Adjust this base URL to match your S3 public bucket config or CloudFront domain
const S3_BASE_URL = "https://ssaf-blog-storage.s3.amazonaws.com";

BlogPost.propTypes = {
  onBack: PropTypes.func,
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
  }).isRequired
};

export default function BlogPost({ post, onBack }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      if (post.filename) {
        try {
          const response = await fetch(`${S3_BASE_URL}/${post.filename}`);
          if (!response.ok) throw new Error("Failed to fetch file");
          const md = await response.text();
          setContent(md);
        } catch (err) {
          console.error("Markdown load failed:", err);
          setContent("⚠️ Failed to load Markdown content.");
        }
      } else {
        setContent("⚠️ No file specified.");
      }
    };

    loadContent();
  }, [post.filename]);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 p-5">
      <div className="bg-gray-200 dark:bg-gray-800 blog-post rounded-lg shadow-md p-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Back to Blogs
        </button>
        <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-gray-200">{post.title}</h2>
        <p className="text-sm mb-6 text-gray-700 dark:text-gray-200">
          <strong>Created on: </strong>{post.createdAt}
          </p>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: (props) => <p className="text-gray-700 leading-relaxed dark:text-gray-400" {...props} />,
            h1: (props) => <h1 className="text-3xl font-bold mt-6 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            h2: (props) => <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            h3: (props) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            h4: (props) => <h4 className="text-lg font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            h5: (props) => <h5 className="text-md font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            h6: (props) => <h6 className="text-sm font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
            li: (props) => <li className="ml-6 list-disc text-gray-700 dark:text-gray-200" {...props} />,
            pre: (props) => (<pre className="bg-gray-900 text-gray-700 dark:text-gray-200 p-4 rounded overflow-x-auto" {...props} />),
            code: ({ inline, ...props }) =>
              inline ? (
                <code className="bg-gray-300 dark:bg-gray-700 px-1 rounded text-sm" {...props} />
              ) : (
                <code {...props} />
            ),
            img: (props) => (<img className="max-w-full h-auto rounded-lg shadow-md" {...props} />),
            a: (props) => (
              <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400" {...props} />
            ),
            table: (props) => (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700" {...props} />
              </div>
            ),
            th: (props) => (
              <th className="border px-4 py-2 bg-gray-200 dark:bg-gray-600" {...props} />
            ),
            td: (props) => (
              <td className="border px-4 py-2 dark:bg-gray-800" {...props} />
            ),
            hr: (props) => (
              <hr className="border-t-2 border-gray-300 my-4 dark:border-gray-500" {...props} />
            ),
            strong: (props) => (
              <strong className="font-bold text-gray-800 dark:text-gray-200" {...props} />
            ),
            em: (props) => (
              <em className="italic text-gray-600 dark:text-gray-400" {...props} />
            ),
            ul: (props) => (
              <ul className="list-disc list-inside pl-4 dark:text-gray-300" {...props} />
            ),
            ol: (props) => (
              <ol className="list-decimal list-inside pl-4 dark:text-gray-300" {...props} />
            ),
            blockquote: (props) => (
              <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600 dark:text-gray-300" {...props} />
            ),
            // Add more custom components as needed
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}