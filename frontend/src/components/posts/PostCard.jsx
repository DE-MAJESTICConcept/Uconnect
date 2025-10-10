import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import postsService from "../../api/postsService";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


const Avatar = ({ name, avatarUrl, size = 40, className = "" }) => {
  const [errored, setErrored] = useState(false);
  const initials = (name || "U").charAt(0).toUpperCase();
  const dim = `${size}px`;

  if (!avatarUrl || errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-bold ${className}`}
        style={{ width: dim, height: dim, backgroundColor: "rgb(41,22,112)" }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      className={`rounded-full object-cover ${className}`}
      style={{ width: dim, height: dim }}
      onError={() => setErrored(true)}
    />
  );
};

// Replace the existing MediaGrid with this robust version



const MediaGrid = ({ media = [] }) => {
  try {
    const all = normalizeMediaInput(media);
    if (!all || all.length === 0) return null;

    if (all.length === 1) {
      const m = all[0];
      return (
        <div className="mb-3 overflow-hidden rounded-lg">
          {m.type === "video" ? (
            <video src={m.url} controls className="w-full rounded-lg object-contain max-h-[520px]" />
          ) : (
            <img src={m.url} alt="post" className="w-full rounded-lg object-contain" loading="lazy" />
          )}
        </div>
      );
    }

    if (all.length === 2) {
      return (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {all.map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={m.url} controls className="w-full h-56 object-contain rounded-lg" />
            ) : (
              <img key={i} src={m.url} alt={`post-${i}`} className="w-full h-56 object-cover rounded-lg" loading="lazy" />
            )
          )}
        </div>
      );
    }

    if (all.length === 3) {
      return (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {all.slice(0, 1).map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={m.url} controls className="w-full h-80 object-contain rounded-lg" />
            ) : (
              <img key={i} src={m.url} alt={`post-${i}`} className="w-full h-80 object-cover rounded-lg" loading="lazy" />
            )
          )}
          <div className="grid grid-rows-2 gap-2">
            {all.slice(1, 3).map((m, i) =>
              m.type === "video" ? (
                <video key={i} src={m.url} controls className="w-full h-full object-contain rounded-lg" />
              ) : (
                <img key={i} src={m.url} alt={`post-${i}`} className="w-full h-full object-cover rounded-lg" loading="lazy" />
              )
            )}
          </div>
        </div>
      );
    }

    // 4+
    return (
      <div className="mb-3 grid grid-cols-2 gap-2">
        {all.slice(0, 4).map((m, i) =>
          m.type === "video" ? (
            <video key={i} src={m.url} controls className="w-full h-56 object-contain rounded-lg" />
          ) : (
            <img key={i} src={m.url} alt={`post-${i}`} className="w-full h-56 object-cover rounded-lg" loading="lazy" />
          )
        )}
      </div>
    );
  } catch (err) {
    console.error("MediaGrid render error:", err);
    return (
      <div className="mb-3 p-3 bg-red-50 rounded-md text-sm text-red-700">
        An error occurred rendering media.
      </div>
    );
  }
};


const PostCard = ({ post, currentUserId, onPostUpdated }) => {
  const authorId = post.author?._id || post.author;
  const authorName = post.author?.name || post.author || "Anonymous";
  const avatar = post.author?.profile?.avatar || post.author?.profile?.avatarUrl || null;
  const media = post.media && post.media.length ? post.media : post.image ? [{ url: post.image, type: "image" }] : [];

  const initialLiked = useMemo(() => {
    if (!post.likes) return false;
    return post.likes.some((id) => String(id) === String(currentUserId));
  }, [post.likes, currentUserId]);

  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    setLiked((v) => !v);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    try {
      const res = await postsService.toggleLike(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
      if (onPostUpdated) onPostUpdated(post._id, { likesCount: res.likesCount, liked: res.liked });
    } catch (err) {
      setLiked((v) => !v);
      setLikesCount(post.likes?.length || 0);
      console.error("Like toggle failed", err);
    }
  };

  const onCommentFilesChange = (e) => {
    const chosen = Array.from(e.target.files || []).slice(0, 4);
    setCommentFiles(chosen);
  };

  const submitComment = async () => {
    if (!commentText.trim() && commentFiles.length === 0) return;
    setSubmittingComment(true);
    try {
      const res = await postsService.createComment({ postId: post._id, content: commentText, files: commentFiles });
      const newComment = res.comment || (res?.comments && res.comments[0]) || null;
      if (newComment) setComments((c) => [newComment, ...c]);
      setCommentText("");
      setCommentFiles([]);
      setShowComments(true);
    } catch (err) {
      console.error("Posting comment failed", err);
      alert("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Link to={authorId ? `/profile/${authorId}` : "#"} className="shrink-0">
            <Avatar name={authorName} avatarUrl={avatar} size={40} />
          </Link>
          <div>
            <Link to={authorId ? `/profile/${authorId}` : "#"} className="font-semibold text-gray-800 hover:underline">
              {authorName}
            </Link>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-medium">
          {post.category || "General"}
        </span>
      </div>

      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>
      <MediaGrid media={media} />

      <div className="flex justify-between items-center text-sm text-gray-600 mt-3 border-t pt-2">
        <button onClick={handleLike} className={`flex items-center space-x-2 ${liked ? "text-[rgb(21,79,29)]" : ""}`}>
          <span role="img" aria-label="like">{liked ? "❤️" : "🤍"}</span>
          <span>{likesCount}</span>
        </button>

        <button onClick={() => setShowComments((s) => !s)} className="flex items-center space-x-2 hover:text-[rgb(41,22,112)]">
          <span>💬</span>
          <span>{post.commentsCount || comments.length || 0}</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-[rgb(196,170,86)]">
          <span>🔗</span>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-3 border-t pt-3 space-y-3">
          {comments.slice(0, 20).map((c) => {
            const commAuthorId = c.author?._id || c.author;
            const commAuthorName = typeof c.author === "object" ? (c.author?.name || "User") : "User";
            const commAvatar = c.author?.profile?.avatar || null;
            return (
              <div key={c._id || String(c.createdAt)} className="flex gap-3">
                <Link to={commAuthorId ? `/profile/${commAuthorId}` : "#"} className="shrink-0">
                  <Avatar name={commAuthorName} avatarUrl={commAvatar} size={36} />
                </Link>
                <div className="flex-1">
                  <div className="text-sm">
                    <Link to={commAuthorId ? `/profile/${commAuthorId}` : "#"} className="font-semibold hover:underline">
                      {commAuthorName}
                    </Link>{" "}
                    <span className="text-xs text-gray-400">· {new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-700">{c.content || c.text || c.body}</div>
                  {c.media?.length > 0 && (
                    <div className="mt-2">
                      {c.media.map((m, idx) =>
                        m.type === "video" ? (
                          <video key={idx} src={m.url} controls className="w-full rounded-lg" />
                        ) : (
                          <img key={idx} src={m.url} alt="comment-media" className="w-full rounded-lg" />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <textarea
              className="w-full border rounded-md p-2 mb-2"
              rows={2}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*,video/*" multiple onChange={onCommentFilesChange} />
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => { setCommentText(""); setCommentFiles([]); }} className="px-3 py-1 rounded-md border">Clear</button>
                <button onClick={submitComment} disabled={submittingComment} className="px-3 py-1 rounded-md bg-[rgb(21,79,29)] text-white">
                  {submittingComment ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;





