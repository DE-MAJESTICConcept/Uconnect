// src/components/feed/CreatePost.jsx
import React, { useState, useEffect } from "react";
import postsService from "../../api/postsService";

const MAX_FILES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const isImage = (file) => file.type.startsWith("image/");
const isVideo = (file) => file.type.startsWith("video/");

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const onFilesChange = (e) => {
    const chosen = Array.from(e.target.files || []).slice(0, MAX_FILES);
    for (const f of chosen) {
      if (isImage(f) && f.size > MAX_IMAGE_SIZE) return alert("Image too large (max 5MB)");
      if (isVideo(f) && f.size > MAX_VIDEO_SIZE) return alert("Video too large (max 50MB)");
      if (!isImage(f) && !isVideo(f)) return alert("Only images/videos allowed");
    }
    const p = chosen.map((f) => ({ url: URL.createObjectURL(f), type: isVideo(f) ? "video" : "image" }));
    previews.forEach((x) => URL.revokeObjectURL(x.url));
    setFiles(chosen);
    setPreviews(p);
  };

  const removePreview = (i) => {
    URL.revokeObjectURL(previews[i].url);
    setPreviews((s) => s.filter((_, idx) => idx !== i));
    setFiles((s) => s.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return alert("Post cannot be empty");
    setLoading(true);
    try {
      const res = await postsService.createPost({ content, category, files });
      setContent("");
      setFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setCategory("General");
      if (onPostCreated) onPostCreated(res);
    } catch (err) {
      console.error("create post failed", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-200 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" rows={3} className="w-full p-3 border rounded-lg" />
        {previews.length > 0 && (
          <div className="grid gap-2 my-3">
            <div className={`${previews.length === 1 ? "grid-cols-1" : "grid-cols-2"} grid gap-2`}>
              {previews.map((p, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg">
                  {p.type === "video" ? <video src={p.url} controls className="w-full h-48 object-cover" /> : <img src={p.url} alt={`preview-${i}`} className="w-full h-48 object-cover" />}
                  <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-3 items-center">
          <input type="file" accept="image/*,video/*" multiple onChange={onFilesChange} className="flex-1 p-2 border rounded-lg" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded-lg bg-white">
            <option value="General">General</option>
            <option value="Events">Events</option>
            <option value="Announcements">Announcements</option>
            <option value="Academics">Academics</option>
          </select>
        </div>
        <div className="flex justify-end mt-3">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-[rgb(21,79,29)] via-[rgb(41,22,112)] to-[rgb(196,170,86)]">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
























// import React, { useState } from "react";
// import axios from "../../api/axios";

// const CreatePost = ({ onPostCreated }) => {
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState("");
//   const [category, setCategory] = useState("General");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!content.trim()) return alert("Post cannot be empty");

//     try {
//       setLoading(true);
//       const res = await axios.post("/posts", {
//         content,
//         image,
//         category,
//       });

//       setContent("");
//       setImage("");
//       setCategory("General");

//       // push new post to parent Dashboard
//       onPostCreated(res.data);
//     } catch (err) {
//       console.error("Error creating post:", err);
//       alert("Failed to create post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-200 mb-6">
//       <form onSubmit={handleSubmit}>
//         {/* Post text input */}
//         <textarea
//           placeholder="What's on your mind?"
//           className="w-full p-3 border rounded-lg resize-none 
//                      focus:outline-none focus:ring-2 focus:ring-transparent
//                      focus:border-transparent focus:bg-gradient-to-r focus:from-[rgb(41,22,112)/10] focus:to-[rgb(21,79,29)/10]"
//           rows="3"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         {/* Image + Category */}
//         <div className="flex gap-3 mt-3">
//           <input
//             type="text"
//             placeholder="Image URL (optional)"
//             className="flex-1 p-2 border rounded-lg focus:outline-none 
//                        focus:ring-2 focus:ring-transparent 
//                        focus:bg-gradient-to-r focus:from-[rgb(196,170,86)/20] focus:to-[rgb(41,22,112)/20]"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//           />
//           <select
//             className="p-2 border rounded-lg bg-white focus:outline-none 
//                        focus:ring-2 focus:ring-transparent 
//                        focus:bg-gradient-to-r focus:from-[rgb(21,79,29)/20] focus:to-[rgb(196,170,86)/20]"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="General">General</option>
//             <option value="Events">Events</option>
//             <option value="Announcements">Announcements</option>
//             <option value="Academics">Academics</option>
//           </select>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end mt-3">
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-5 py-2 rounded-lg text-white font-medium shadow-md 
//                        bg-gradient-to-r from-[rgb(21,79,29)] via-[rgb(41,22,112)] to-[rgb(196,170,86)] 
//                        hover:opacity-90 transition disabled:opacity-60"
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreatePost;
