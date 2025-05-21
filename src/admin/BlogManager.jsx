/** 
 * File: BlogManager.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The blog manager page for the showcase site. This is where the
 *              user can create and manage blog posts.
 * 
 * Props:
 * None
 * 
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 * 
 * Dependencies:
 * - React
 * - BlogEditor: A component for creating and editing blog posts.
 * - BlogPost: A component for displaying a blog post.
 * - useState: A React hook for managing state.
 * 
*/

import React, { useState } from "react";
import BlogEditor from "../components/BlogEditor";
import BlogPost from "../components/BlogPost";

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSave = (newPost) => {
    setPosts([...posts, newPost]);
    setSelectedPost(newPost);
  };

  return (
    <div className="mb-10">
      {!selectedPost && <BlogEditor onSave={handleSave} />}
      {selectedPost && <BlogPost post={selectedPost} />}
    </div>
  );
}