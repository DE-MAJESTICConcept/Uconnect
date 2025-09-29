import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize API response into an array of posts
  const normalizePostsResponse = (resData) => {
    if (!resData) return [];
    // If backend returns { posts: [...] , total: N }
    if (Array.isArray(resData.posts)) return resData.posts;
    // If backend returns a bare array [...]
    if (Array.isArray(resData)) return resData;
    // If backend returns { data: [...] } (axios wrapper in some APIs)
    if (Array.isArray(resData.data)) return resData.data;
    // Unknown shape
    return [];
  };

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts");
      const arr = normalizePostsResponse(res.data);
      // newest first — make a copy before reversing to avoid mutating original
      const newestFirst = Array.isArray(arr) ? arr.slice().reverse() : [];
      setPosts(newestFirst);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = async () => {
    // Always refresh from backend to stay consistent
    await fetchPosts();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto w-full">
      {/* Gradient header */}
      <h1
        className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text 
                   bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)]"
      >
        CampusConnect Feed
      </h1>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id || post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-6">
          No posts yet. Be the first!
        </p>
      )}
    </div>
  );
};

export default Feed;
