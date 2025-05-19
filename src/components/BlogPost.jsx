import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from 'prop-types';

BlogPost.propTypes = {
    onBack: PropTypes.func.isRequired,
    post: {
        title: PropTypes.object.isRequired,
        date: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,

    }
};

    export default function BlogPost({ post, onBack }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-600 p-5">
        <div className="bg-gray-200 dark:bg-gray-800 blog-post rounded-lg shadow-md p-6">
            <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
            >
            ← Back to Blogs
            </button>
            <h2 className="text-3xl font-bold mb-4 dark:text-gray-200">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-6 dark:text-gray-300">{post.date}</p>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node: _node, ...props }) => (
                    <p className="text-gray-700 leading-relaxed dark:text-gray-400" {...props} />
                    ),
                    h1: ({ node: _node, ...props }) => (
                    <h1 className="text-3xl font-bold mt-6 mb-2 dark:text-white" {...props} />
                    ),
                    h2: ({ node: _node, ...props }) => (
                    <h2 className="text-2xl font-bold mt-4 mb-2 dark:text-white" {...props} />
                    ),
                    li: ({ node: _node, ...props }) => (
                    <li className="ml-6 list-disc dark:text-gray-300" {...props} />
                    ),
                    code: ({ node: _node, inline, ...props }) =>
                    inline ? (
                        <code className="bg-gray-300 dark:bg-gray-700 px-1 rounded text-sm" {...props} />
                    ) : (
                        <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
                        <code {...props} />
                        </pre>
                    ),
                }}
                >
                {post.content}
            </ReactMarkdown>
        </div>
        </div>
    );
}
