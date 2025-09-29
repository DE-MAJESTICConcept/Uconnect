// src/components/profile/PublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import profileService from "../../api/profileService";
import friendsService from "../../api/friendsService";
import postsService from "../../api/postsService";
import MutualFriends from "./MutualFriends";
// import axios from "axios";



import { ensureConversation } from "../../api/messagesService";


const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
const urlOrAbsolute = (val) => (val ? (String(val).startsWith("http") ? val : `${BACKEND_ORIGIN}${val}`) : null);


const AvatarFallback = ({ name, size = 72 }) => {
  const initials = (name || "U").charAt(0).toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[rgb(41,22,112)] text-white flex items-center justify-center text-2xl font-bold"
    >
      {initials}
    </div>
  );
};

const PostMini = ({ post }) => {
  const media = post.media && post.media.length ? post.media : post.image ? [{ url: post.image }] : [];
  const thumb = media[0]?.url || null;
  return (
    <Link to={`/posts/${post._id || post.id}`} className="block bg-white rounded-lg shadow p-3 hover:shadow-md transition">
      {thumb ? (
        <img src={thumb} alt="post thumbnail" className="w-full h-36 object-cover rounded-md mb-2" loading="lazy" />
      ) : (
        <div className="w-full h-36 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">No image</div>
      )}
      <div className="text-sm text-gray-800 font-semibold truncate">{post.content ? post.content.slice(0, 80) : "No text"}</div>
      <div className="text-xs text-gray-500 mt-1">{new Date(post.createdAt || Date.now()).toLocaleString()}</div>
    </Link>
  );
};

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarErrored, setAvatarErrored] = useState(false);
  const [coverErrored, setCoverErrored] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Load profile
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await profileService.getProfileById(id);
        console.log("🔍 Loaded profile:", data);
        setUser(data);
      } catch (e) {
        console.error("Failed to load profile", e);
        setUser(null);
      } finally {
        setLoading(false);
        setAvatarErrored(false);
        setCoverErrored(false);
      }
    })();
  }, [id]);

  // Load posts
  useEffect(() => {
    (async () => {
      if (!user) {
        setPosts([]);
        return;
      }
      setLoadingPosts(true);
      try {
        const data = await postsService.getPosts({ author: id, limit: 3 });
        const list = Array.isArray(data) ? data : data.posts || data.data || [];
        setPosts(list);
      } catch (err) {
        console.error("Failed to load recent posts", err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    })();
  }, [user, id]);

  if (loading) return <div className="p-6 text-center">Loading profile…</div>;
  if (!user) return <div className="p-6 text-center">Profile not found</div>;

  const coverUrl = urlOrAbsolute(user.profile?.cover);
  const avatarUrl = urlOrAbsolute(user.profile?.avatar);
  const name = user.name || "User";
  const department = user.profile?.department;
  const bio = user.profile?.bio;
  const friendStatus = user.friendStatus || "none"; // none | self | friends | requested_sent | requested_received
  const friendRequestId = user.friendRequestId || null;
  const isSelf = friendStatus === "self";

  const handleSendRequest = async () => {
    setActionLoading(true);
    try {
      await friendsService.sendRequest(user._id || id);
      setUser((u) => ({ ...u, friendStatus: "requested_sent" }));
    } catch (err) {
      console.error("send request failed", err);
      alert(err?.response?.data?.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!friendRequestId) return alert("Missing request id");
    setActionLoading(true);
    try {
      await friendsService.acceptRequest(friendRequestId);
      const freshProfile = await profileService.getProfileById(user._id || id);
      setUser(freshProfile);
    } catch (err) {
      console.error("accept failed", err);
      alert("Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!friendRequestId) return alert("Missing request id");
    setActionLoading(true);
    try {
      await friendsService.rejectRequest(friendRequestId);
      const freshProfile = await profileService.getProfileById(user._id || id);
      setUser(freshProfile);
    } catch (err) {
      console.error("reject failed", err);
      alert("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfriend = async () => {
    const friendId = user._id || id;
    if (!confirm("Unfriend this person?")) return;
    setActionLoading(true);
    try {
      await friendsService.unfriend(friendId);
      const freshProfile = await profileService.getProfileById(friendId);
      setUser(freshProfile);
    } catch (err) {
      console.error("unfriend failed", err);
      alert("Failed to unfriend");
    } finally {
      setActionLoading(false);
    }
  };
 
const handleMessage = async () => {
  try {
    const friendId = user?._id || id;   // fallback to URL param if missing
    console.log("📩 Starting conversation with:", friendId);

    const conv = await ensureConversation(friendId);
    navigate(`/messages?c=${conv._id}`); // redirect into Messages.jsx with conversation id
  } catch (err) {
    console.error("Error starting conversation:", err);
    alert("Failed to start conversation");
  }
};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Cover */}
        <div className="h-48 w-full bg-gray-200 rounded-b-2xl overflow-hidden">
          {coverUrl && !coverErrored ? (
            <img
              src={coverUrl}
              alt="cover"
              className="w-full h-full object-cover"
              onError={() => setCoverErrored(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)]" />
          )}
        </div>

        {/* Avatar + header */}
        <div className="px-4 -mt-12 flex items-end gap-4">
          <div
            className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center"
            style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
          >
            {avatarUrl && !avatarErrored ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setAvatarErrored(true)}
              />
            ) : (
              <AvatarFallback name={name} size={112} />
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                {department && <p className="text-sm text-gray-500">{department}</p>}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {!isSelf && (
                  <>
                    {friendStatus === "none" && (
                      <button
                        onClick={handleSendRequest}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                        style={{ backgroundColor: "#2d0a6b" }}
                      >
                        {actionLoading ? "Sending..." : "Add Friend"}
                      </button>
                    )}

                    {friendStatus === "requested_sent" && (
                      <button disabled className="px-4 py-2 rounded-md text-sm font-semibold border">
                        Pending
                      </button>
                    )}

                    {friendStatus === "requested_received" && (
                      <>
                        <button
                          onClick={handleAccept}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                          style={{ backgroundColor: "#2d0a6b" }}
                        >
                          {actionLoading ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-md text-sm font-semibold border"
                        >
                          {actionLoading ? "Working..." : "Reject"}
                        </button>
                      </>
                    )}

                    {friendStatus === "friends" && (
                      <>
                          <button
      onClick={handleMessage}
      className="px-4 py-2 rounded-md text-sm font-semibold"
      style={{ backgroundColor: "#c2a233", color: "#111827" }}
    >
      Message
    </button>
                        <button
                          onClick={handleUnfriend}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-md text-sm font-semibold border"
                        >
                          {actionLoading ? "Working..." : "Unfriend"}
                        </button>
                      </>
                    )}
                  </>
                )}

                {isSelf && (
                  <Link
                    to="/profile"
                    className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                    style={{ backgroundColor: "#2d0a6b" }}
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mutual friends */}
      <div className="mt-4">
        <MutualFriends targetId={id} max={3} />
      </div>

      {/* Bio + details */}
      <div className="px-4 mt-4">
        {bio && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{bio}</p>}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500">Joined</div>
            <div className="font-medium mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500">Friends</div>
            <div className="font-medium mt-1">{(user.friends && user.friends.length) || "—"}</div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500">Department</div>
            <div className="font-medium mt-1">{department || "—"}</div>
          </div>
        </div>

        {/* Recent posts */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Recent posts</h3>
            <div>
              <Link to={`/profile/${id}/posts`} className="text-sm text-[rgb(41,22,112)] hover:underline">
                View all posts
              </Link>
            </div>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-gray-500">No posts yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {posts.map((p) => (
                <PostMini key={p._id || p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




// // src/components/profile/PublicProfile.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import profileService from "../../api/profileService";
// import friendsService from "../../api/friendsService";
// import postsService from "../../api/postsService";
// import MutualFriends from "./MutualFriends";
// // import axios from "axios";

// const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
// const urlOrAbsolute = (val) => (val ? (String(val).startsWith("http") ? val : `${BACKEND_ORIGIN}${val}`) : null);

// const AvatarFallback = ({ name, size = 72 }) => {
//   const initials = (name || "U").charAt(0).toUpperCase();
//   return (
//     <div
//       style={{ width: size, height: size }}
//       className="rounded-full bg-[rgb(41,22,112)] text-white flex items-center justify-center text-2xl font-bold"
//     >
//       {initials}
//     </div>
//   );
// };

// const PostMini = ({ post }) => {
//   const media = post.media && post.media.length ? post.media : post.image ? [{ url: post.image }] : [];
//   const thumb = media[0]?.url || null;
//   return (
//     <Link to={`/posts/${post._id || post.id}`} className="block bg-white rounded-lg shadow p-3 hover:shadow-md transition">
//       {thumb ? (
//         <img src={thumb} alt="post thumbnail" className="w-full h-36 object-cover rounded-md mb-2" loading="lazy" />
//       ) : (
//         <div className="w-full h-36 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">No image</div>
//       )}
//       <div className="text-sm text-gray-800 font-semibold truncate">{post.content ? post.content.slice(0, 80) : "No text"}</div>
//       <div className="text-xs text-gray-500 mt-1">{new Date(post.createdAt || post.createdAt || Date.now()).toLocaleString()}</div>
//     </Link>
//   );
// };

// export default function PublicProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [avatarErrored, setAvatarErrored] = useState(false);
//   const [coverErrored, setCoverErrored] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   {/* Mutual friends */}
//   <div className="mt-4">
//     <MutualFriends targetId={id} max={3} />
//   </div>;

//   // Load profile data
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await profileService.getProfileById(id);
//         console.log("Fetched profile:", data);
//         setUser(data);
//       } catch (e) {
//         console.error("Failed to load profile", e);
//         setUser(null);
//       } finally {
//         setLoading(false);
//         setAvatarErrored(false);
//         setCoverErrored(false);
//       }
//     })();
//   }, [id]);

//   // recent posts
//   const [posts, setPosts] = useState([]);
//   const [loadingPosts, setLoadingPosts] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (!user) {
//         setPosts([]);
//         return;
//       }
//       setLoadingPosts(true);
//       try {
//         const data = await postsService.getPosts({ author: id, limit: 3 });
//         const list = Array.isArray(data) ? data : data.posts || data.data || [];
//         setPosts(list);
//       } catch (err) {
//         console.error("Failed to load recent posts", err);
//         setPosts([]);
//       } finally {
//         setLoadingPosts(false);
//       }
//     })();
//   }, [user, id]);

//   if (loading) return <div className="p-6 text-center">Loading profile…</div>;
//   if (!user) return <div className="p-6 text-center">Profile not found</div>;

//   const coverUrl = urlOrAbsolute(user.profile?.cover);
//   const avatarUrl = urlOrAbsolute(user.profile?.avatar);
//   const name = user.name || "User";
//   const department = user.profile?.department;
//   const bio = user.profile?.bio;

//   const friendStatus = user.friendStatus || "none";
//   const friendRequestId = user.friendRequestId || null;
//   const isSelf = friendStatus === "self";

//   // ✅ Fallback check: consider user a friend if current user is in user.friends
//   const currentUserId = localStorage.getItem("userId"); // make sure you store this at login
//   const isFriend = Array.isArray(user.friends) && currentUserId
//     ? user.friends.some(f => String(f) === String(currentUserId))
//     : false;

//   const handleSendRequest = async () => {
//     setActionLoading(true);
//     try {
//       await friendsService.sendRequest(user._id || id);
//       setUser((u) => ({ ...u, friendStatus: "requested_sent" }));
//     } catch (err) {
//       console.error("send request failed", err);
//       alert(err?.response?.data?.message || "Failed to send request");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleAccept = async () => {
//     if (!friendRequestId) return alert("Missing request id");
//     setActionLoading(true);
//     try {
//       await friendsService.acceptRequest(friendRequestId);
//       const freshProfile = await profileService.getProfileById(user._id || id);
//       setUser(freshProfile);
//     } catch (err) {
//       console.error("accept failed", err);
//       alert("Failed to accept request");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!friendRequestId) return alert("Missing request id");
//     setActionLoading(true);
//     try {
//       await friendsService.rejectRequest(friendRequestId);
//       const freshProfile = await profileService.getProfileById(user._id || id);
//       setUser(freshProfile);
//     } catch (err) {
//       console.error("reject failed", err);
//       alert("Failed to reject request");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUnfriend = async () => {
//     const friendId = user._id || id;
//     if (!confirm("Unfriend this person?")) return;
//     setActionLoading(true);
//     try {
//       await friendsService.unfriend(friendId);
//       const freshProfile = await profileService.getProfileById(friendId);
//       setUser(freshProfile);
//     } catch (err) {
//       console.error("unfriend failed", err);
//       alert("Failed to unfriend");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleMessage = () => {
//     if (user?._id || id) navigate(`/messages?to=${user._id || id}`);
//     else navigate("/messages");
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="relative">
//         {/* Cover */}
//         <div className="h-48 w-full bg-gray-200 rounded-b-2xl overflow-hidden">
//           {coverUrl && !coverErrored ? (
//             <img
//               src={coverUrl}
//               alt="cover"
//               className="w-full h-full object-cover"
//               onError={() => setCoverErrored(true)}
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)]" />
//           )}
//         </div>

//         {/* Avatar + header */}
//         <div className="px-4 -mt-12 flex items-end gap-4">
//           <div
//             className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center"
//             style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
//           >
//             {avatarUrl && !avatarErrored ? (
//               <img
//                 src={avatarUrl}
//                 alt={name}
//                 className="w-full h-full object-cover"
//                 onError={() => setAvatarErrored(true)}
//               />
//             ) : (
//               <AvatarFallback name={name} size={112} />
//             )}
//           </div>

//           <div className="flex-1 pb-2">
//             <div className="flex items-center gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold">{name}</h1>
//                 {department && <p className="text-sm text-gray-500">{department}</p>}
//               </div>

//               <div className="ml-auto flex items-center gap-2">
//                 {!isSelf && (
//                   <>
//                     {friendStatus === "none" && !isFriend && (
//                       <button
//                         onClick={handleSendRequest}
//                         disabled={actionLoading}
//                         className="px-4 py-2 rounded-md text-white text-sm font-semibold"
//                         style={{ backgroundColor: "#2d0a6b" }}
//                       >
//                         {actionLoading ? "Sending..." : "Add Friend"}
//                       </button>
//                     )}

//                     {(friendStatus === "requested_sent" && !isFriend) && (
//                       <button disabled className="px-4 py-2 rounded-md text-sm font-semibold border">
//                         Pending
//                       </button>
//                     )}

//                     {friendStatus === "requested_received" && !isFriend && (
//                       <>
//                         <button
//                           onClick={handleAccept}
//                           disabled={actionLoading}
//                           className="px-4 py-2 rounded-md text-white text-sm font-semibold"
//                           style={{ backgroundColor: "#2d0a6b" }}
//                         >
//                           {actionLoading ? "Accepting..." : "Accept"}
//                         </button>
//                         <button
//                           onClick={handleReject}
//                           disabled={actionLoading}
//                           className="px-4 py-2 rounded-md text-sm font-semibold border"
//                         >
//                           {actionLoading ? "Working..." : "Reject"}
//                         </button>
//                       </>
//                     )}

//                     {(friendStatus === "friends" || isFriend) && (
//                       <>
//                         <button
//                           onClick={handleMessage}
//                           className="px-4 py-2 rounded-md text-sm font-semibold"
//                           style={{ backgroundColor: "#c2a233", color: "#111827" }}
//                         >
//                           Message
//                         </button>
//                         <button
//                           onClick={handleUnfriend}
//                           disabled={actionLoading}
//                           className="px-4 py-2 rounded-md text-sm font-semibold border"
//                         >
//                           {actionLoading ? "Working..." : "Unfriend"}
//                         </button>
//                       </>
//                     )}
//                   </>
//                 )}

//                 {isSelf && (
//                   <Link
//                     to="/profile"
//                     className="px-4 py-2 rounded-md text-white text-sm font-semibold"
//                     style={{ backgroundColor: "#2d0a6b" }}
//                   >
//                     Edit Profile
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bio + details */}
//       <div className="px-4 mt-4">
//         {bio && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{bio}</p>}

//         <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white rounded-2xl shadow p-4">
//             <div className="text-sm text-gray-500">Joined</div>
//             <div className="font-medium mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
//           </div>

//           <div className="bg-white rounded-2xl shadow p-4">
//             <div className="text-sm text-gray-500">Friends</div>
//             <div className="font-medium mt-1">{(user.friends && user.friends.length) || "—"}</div>
//           </div>

//           <div className="bg-white rounded-2xl shadow p-4">
//             <div className="text-sm text-gray-500">Department</div>
//             <div className="font-medium mt-1">{department || "—"}</div>
//           </div>
//         </div>

//         {/* Recent posts */}
//         <div className="mt-6">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-semibold text-gray-800">Recent posts</h3>
//             <div>
//               <Link to={`/profile/${id}/posts`} className="text-sm text-[rgb(41,22,112)] hover:underline">
//                 View all posts
//               </Link>
//             </div>
//           </div>

//           {loadingPosts ? (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
//               ))}
//             </div>
//           ) : posts.length === 0 ? (
//             <div className="text-gray-500">No posts yet.</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {posts.map((p) => (
//                 <PostMini key={p._id || p.id} post={p} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }














// // // src/components/profile/PublicProfile.jsx
// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate, Link } from "react-router-dom";
// // import profileService from "../../api/profileService";
// // import friendsService from "../../api/friendsService";
// // import postsService from "../../api/postsService";
// // import MutualFriends from "./MutualFriends";
// // import axios from "axios";



// // // derive backend origin from VITE_API_BASE_URL (fallback to localhost:5000)
// // const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
// // const urlOrAbsolute = (val) => (val ? (String(val).startsWith("http") ? val : `${BACKEND_ORIGIN}${val}`) : null);

// // const AvatarFallback = ({ name, size = 72 }) => {
// //   const initials = (name || "U").charAt(0).toUpperCase();
// //   return (
// //     <div
// //       style={{ width: size, height: size }}
// //       className="rounded-full bg-[rgb(41,22,112)] text-white flex items-center justify-center text-2xl font-bold"
// //     >
// //       {initials}
// //     </div>
// //   );
// // };

// // const PostMini = ({ post }) => {
// //   const media = post.media && post.media.length ? post.media : post.image ? [{ url: post.image }] : [];
// //   const thumb = media[0]?.url || null;
// //   return (
// //     <Link to={`/posts/${post._id || post.id}`} className="block bg-white rounded-lg shadow p-3 hover:shadow-md transition">
// //       {thumb ? (
// //         <img src={thumb} alt="post thumbnail" className="w-full h-36 object-cover rounded-md mb-2" loading="lazy" />
// //       ) : (
// //         <div className="w-full h-36 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">No image</div>
// //       )}
// //       <div className="text-sm text-gray-800 font-semibold truncate">{post.content ? post.content.slice(0, 80) : "No text"}</div>
// //       <div className="text-xs text-gray-500 mt-1">{new Date(post.createdAt || post.createdAt || Date.now()).toLocaleString()}</div>
// //     </Link>
// //   );
// // };

// // export default function PublicProfile() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [avatarErrored, setAvatarErrored] = useState(false);
// //   const [coverErrored, setCoverErrored] = useState(false);
// //   const [actionLoading, setActionLoading] = useState(false);


 


// //   {/* Mutual friends */}
// // <div className="mt-4">
// //   <MutualFriends targetId={id} max={3} />
// // </div>


// // const [profile, setProfile] = useState(null);
// // useEffect(() => {
// //   const fetchProfile = async () => {
// //     try {
// //       const { data } = await axios.api.get(`/profile/${id}`); // id from route params
// //       console.log("Fetched profile:", data);
// //       setProfile(data);
// //     } catch (err) {
// //       console.error("Error fetching profile:", err);
// //     }
// //   };

// //   fetchProfile();
// // }, [id]);


// //   // recent posts
// //   const [posts, setPosts] = useState([]);
// //   const [loadingPosts, setLoadingPosts] = useState(false);

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       try {
// //         const data = await profileService.getProfileById(id);
// //         setUser(data);
// //       } catch (e) {
// //         console.error("Failed to load profile", e);
// //         setUser(null);
// //       } finally {
// //         setLoading(false);
// //         setAvatarErrored(false);
// //         setCoverErrored(false);
// //       }
// //     })();
// //   }, [id]);

  

// //   // fetch recent posts when user loaded (or id changes)
// //   useEffect(() => {
// //     (async () => {
// //       if (!user) {
// //         setPosts([]);
// //         return;
// //       }
// //       setLoadingPosts(true);
// //       try {
// //         // expects backend to support GET /posts?author=<id>&limit=3
// //         const data = await postsService.getPosts({ author: id, limit: 3 });
// //         // many APIs return { posts: [...] } or an array; handle both
// //         const list = Array.isArray(data) ? data : data.posts || data.data || [];
// //         setPosts(list);
// //       } catch (err) {
// //         console.error("Failed to load recent posts", err);
// //         setPosts([]);
// //       } finally {
// //         setLoadingPosts(false);
// //       }
// //     })();
// //   }, [user, id]);

// //   if (loading) return <div className="p-6 text-center">Loading profile…</div>;
// //   if (!user) return <div className="p-6 text-center">Profile not found</div>;

// //   const coverUrl = urlOrAbsolute(user.profile?.cover);
// //   const avatarUrl = urlOrAbsolute(user.profile?.avatar);
// //   const name = user.name || "User";
// //   const department = user.profile?.department;
// //   const bio = user.profile?.bio;
// //   const friendStatus = user.friendStatus || "none"; // none | self | friends | requested_sent | requested_received
// //   const friendRequestId = user.friendRequestId || null;
// //   const isSelf = friendStatus === "self";

// //   const handleSendRequest = async () => {
// //     setActionLoading(true);
// //     try {
// //       await friendsService.sendRequest(user._id || id);
// //       setUser((u) => ({ ...u, friendStatus: "requested_sent" }));
// //     } catch (err) {
// //       console.error("send request failed", err);
// //       alert(err?.response?.data?.message || "Failed to send request");
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// // const handleAccept = async () => {
// //   if (!friendRequestId) return alert("Missing request id");
// //   setActionLoading(true);
// //   try {
// //     await friendsService.acceptRequest(friendRequestId);

// //     // ✅ Fetch fresh profile from backend so UI updates
// //     const freshProfile = await profileService.getProfileById(user._id || id);
// //     setUser(freshProfile);

// //   } catch (err) {
// //     console.error("accept failed", err);
// //     alert("Failed to accept request");
// //   } finally {
// //     setActionLoading(false);
// //   }
// // };

// // const handleReject = async () => {
// //   if (!friendRequestId) return alert("Missing request id");
// //   setActionLoading(true);
// //   try {
// //     await friendsService.rejectRequest(friendRequestId);

// //     // ✅ Fetch fresh profile (friendStatus should become "none")
// //     const freshProfile = await profileService.getProfileById(user._id || id);
// //     setUser(freshProfile);

// //   } catch (err) {
// //     console.error("reject failed", err);
// //     alert("Failed to reject request");
// //   } finally {
// //     setActionLoading(false);
// //   }
// // };

// // const handleUnfriend = async () => {
// //   const friendId = user._id || id;
// //   if (!confirm("Unfriend this person?")) return;
// //   setActionLoading(true);
// //   try {
// //     await friendsService.unfriend(friendId);

// //     // ✅ Fetch fresh profile (friendStatus should become "none")
// //     const freshProfile = await profileService.getProfileById(friendId);
// //     setUser(freshProfile);

// //   } catch (err) {
// //     console.error("unfriend failed", err);
// //     alert("Failed to unfriend");
// //   } finally {
// //     setActionLoading(false);
// //   }
// // };


// //   const handleMessage = () => {
// //     if (user?._id || id) navigate(`/messages?to=${user._id || id}`);
// //     else navigate("/messages");
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto">
// //       <div className="relative">
// //         {/* Cover */}
// //         <div className="h-48 w-full bg-gray-200 rounded-b-2xl overflow-hidden">
// //           {coverUrl && !coverErrored ? (
// //             <img
// //               src={coverUrl}
// //               alt="cover"
// //               className="w-full h-full object-cover"
// //               onError={() => setCoverErrored(true)}
// //             />
// //           ) : (
// //             <div className="w-full h-full bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)]" />
// //           )}
// //         </div>

// //         {/* Avatar + header */}
// //         <div className="px-4 -mt-12 flex items-end gap-4">
// //           <div
// //             className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center"
// //             style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
// //           >
// //             {avatarUrl && !avatarErrored ? (
// //               <img
// //                 src={avatarUrl}
// //                 alt={name}
// //                 className="w-full h-full object-cover"
// //                 onError={() => setAvatarErrored(true)}
// //               />
// //             ) : (
// //               <AvatarFallback name={name} size={112} />
// //             )}
// //           </div>

// //           <div className="flex-1 pb-2">
// //             <div className="flex items-center gap-4">
// //               <div>
// //                 <h1 className="text-2xl font-bold">{name}</h1>
// //                 {department && <p className="text-sm text-gray-500">{department}</p>}
// //               </div>

// //               <div className="ml-auto flex items-center gap-2">
// //                 {!isSelf && (
// //                   <>
// //                     {friendStatus === "none" && (
// //                       <button
// //                         onClick={handleSendRequest}
// //                         disabled={actionLoading}
// //                         className="px-4 py-2 rounded-md text-white text-sm font-semibold"
// //                         style={{ backgroundColor: "#2d0a6b" }}
// //                       >
// //                         {actionLoading ? "Sending..." : "Add Friend"}
// //                       </button>
// //                     )}
               


// //                     {friendStatus === "requested_sent" && (
// //                       <button disabled className="px-4 py-2 rounded-md text-sm font-semibold border">
// //                         Pending
// //                       </button>
// //                     )}

// //                     {friendStatus === "requested_received" && (
// //                       <>
// //                         <button
// //                           onClick={handleAccept}
// //                           disabled={actionLoading}
// //                           className="px-4 py-2 rounded-md text-white text-sm font-semibold"
// //                           style={{ backgroundColor: "#2d0a6b" }}
// //                         >
// //                           {actionLoading ? "Accepting..." : "Accept"}
// //                         </button>
// //                         <button
// //                           onClick={handleReject}
// //                           disabled={actionLoading}
// //                           className="px-4 py-2 rounded-md text-sm font-semibold border"
// //                         >
// //                           {actionLoading ? "Working..." : "Reject"}
// //                         </button>

// //                       </>
// //                     )}

// //    {profile?.friendStatus === "accepted" && (
// //   <button
// //     className="px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2"
// //     style={{ backgroundColor: "#c2a233", color: "#111827", cursor: "pointer" }}
// //     onClick={() => navigate(`/messages?to=${profile._id}`)}
// //   >
// //     Message
// //   </button>
// // )}


// //                     {friendStatus === "friends" && (
// //                       <>
// //                         <button
// //                           onClick={handleMessage}
// //                           className="px-4 py-2 rounded-md text-sm font-semibold"
// //                           style={{ backgroundColor: "#c2a233", color: "#111827" }}
// //                         >
// //                           Message
// //                         </button>
// //                         <button
// //                           onClick={handleUnfriend}
// //                           disabled={actionLoading}
// //                           className="px-4 py-2 rounded-md text-sm font-semibold border"
// //                         >
// //                           {actionLoading ? "Working..." : "Unfriend"}
// //                         </button>
// //                       </>
// //                     )}
// //                   </>
// //                 )}

// //                 {isSelf && (
// //                   <Link
// //                     to="/profile"
// //                     className="px-4 py-2 rounded-md text-white text-sm font-semibold"
// //                     style={{ backgroundColor: "#2d0a6b" }}
// //                   >
// //                     Edit Profile
// //                   </Link>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Bio + details */}
// //       <div className="px-4 mt-4">
// //         {bio && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{bio}</p>}

// //         <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
// //           <div className="bg-white rounded-2xl shadow p-4">
// //             <div className="text-sm text-gray-500">Joined</div>
// //             <div className="font-medium mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
// //           </div>

// //           <div className="bg-white rounded-2xl shadow p-4">
// //             <div className="text-sm text-gray-500">Friends</div>
// //             <div className="font-medium mt-1">{(user.friends && user.friends.length) || "—"}</div>
// //           </div>

// //           <div className="bg-white rounded-2xl shadow p-4">
// //             <div className="text-sm text-gray-500">Department</div>
// //             <div className="font-medium mt-1">{department || "—"}</div>
// //           </div>
// //         </div>

// //         {/* Recent posts */}
// //         <div className="mt-6">
// //           <div className="flex items-center justify-between mb-3">
// //             <h3 className="text-lg font-semibold text-gray-800">Recent posts</h3>
// //             <div>
// //               <Link to={`/profile/${id}/posts`} className="text-sm text-[rgb(41,22,112)] hover:underline">
// //                 View all posts
// //               </Link>
// //             </div>
// //           </div>

// //           {loadingPosts ? (
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               {[1, 2, 3].map((i) => (
// //                 <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
// //               ))}
// //             </div>
// //           ) : posts.length === 0 ? (
// //             <div className="text-gray-500">No posts yet.</div>
// //           ) : (
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               {posts.map((p) => (
// //                 <PostMini key={p._id || p.id} post={p} />
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

