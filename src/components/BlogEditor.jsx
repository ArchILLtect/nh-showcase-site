import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import PropTypes from 'prop-types';

BlogEditor.propTypes = {
    onSave: PropTypes.node.isRequired
};

export default function BlogEditor({ onSave }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const newPost = {
      id: Date.now(),
      author: "Nick Hanson",
      title,
      content,
      date: new Date().toISOString().split("T")[0],
    };
    onSave(newPost);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <input
        type="text"
        className="w-full mb-4 p-2 rounded text-black"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <SimpleMDE value={content} onChange={setContent} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Post
      </button>
    </div>
  );
}
