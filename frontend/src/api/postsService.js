// src/api/postsService.js
import api from "./axios";

/**
 * Get posts with optional query params (author, category, limit, page, etc.)
 * Example: getPosts({ author: "userId", limit: 3 })
 */
export const getPosts = async (params = {}) => {
  const { data } = await api.get("/posts", { params });
  return data;
};

export const getPostsByAuthor = async (authorId, limit = 3) => {
  const { data } = await api.get("/posts", { params: { author: authorId, limit } });
  return data;
};

export const createPost = async ({ content, category, files = [] }) => {
  const form = new FormData();
  form.append("content", content);
  if (category) form.append("category", category);
  files.forEach((f) => form.append("media", f)); // field name 'media'
  const { data } = await api.post("/posts", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const toggleLike = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const createComment = async ({ postId, content, files = [] }) => {
  const form = new FormData();
  form.append("content", content);
  files.forEach((f) => form.append("media", f));
  const { data } = await api.post(`/posts/${postId}/comments`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message, comment }
};

export default { getPosts, getPostsByAuthor, createPost, toggleLike, createComment };
// // src/api/postsService.js
// import api from "./axios";

// export const getPosts = async () => {
//   const { data } = await api.get("/posts");
//   return data;
// };

// export const createPost = async ({ content, category, files = [] }) => {
//   const form = new FormData();
//   form.append("content", content);
//   if (category) form.append("category", category);
//   files.forEach((f) => form.append("media", f)); // field name 'media'
//   const { data } = await api.post("/posts", form, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data;
// };

// export const toggleLike = async (postId) => {
//   const { data } = await api.post(`/posts/${postId}/like`);
//   return data;
// };

// export const createComment = async ({ postId, content, files = [] }) => {
//   const form = new FormData();
//   form.append("content", content);
//   files.forEach((f) => form.append("media", f));
//   const { data } = await api.post(`/posts/${postId}/comments`, form, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data; // { message, comment }
// };

// export default { getPosts, createPost, toggleLike, createComment };
