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
    if (Array.isArray(resData.posts)) return resData.posts;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.data)) return resData.data;
    return [];
  };

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts");
      const arr = normalizePostsResponse(res.data);
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
    await fetchPosts();
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-2xl mx-auto w-full">
      {/* Gradient header (responsive text size) */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-transparent bg-clip-text 
                   bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)]"
      >
        CampusConnect Feed
      </h1>

      {/* Create Post Box */}
      <div className="mb-6">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg bg-gray-200 h-24 w-full"
            ></div>
          ))}
        </div>
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
