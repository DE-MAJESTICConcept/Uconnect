import React from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../../context/FriendsContext";
import { ensureConversation } from "../../api/messagesService";

export default function FriendsManager() {
  const { requests, friends, loading, processing, acceptRequest, rejectRequest, unfriend } = useFriends();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const startConversationAndGo = async (friendId) => {
    try {
      const res = await ensureConversation(friendId, token);
      const convo = res?.conversation ?? res?.data ?? res;
      const id = convo?._id ?? convo?.id;

      if (id) {
        navigate(`/messages?to=${friendId}&c=${id}`);
      } else {
        navigate(`/messages?to=${friendId}`);
      }
    } catch (err) {
      console.error("Could not create/open conversation", err);
      navigate(`/messages?to=${friendId}`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    // Responsive layout: single column on mobile, two columns on medium screens and up
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Friend Requests */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-[rgb(41,22,112)] border-b pb-2">Friend Requests</h3>
        {requests.length === 0 ? (
          <div className="text-sm text-gray-500 py-4">No pending requests</div>
        ) : (
          requests.map((r) => {
            const from = r.from || r.fromUser || {};
            return (
              <div
                key={`request-${r._id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 transition rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-800">{from.name ?? from.username ?? "User"}</div>
                  <div className="text-xs text-gray-500">{from.email}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => acceptRequest(r._id)}
                    disabled={!!processing?.[r._id]}
                    className="px-3 py-1 rounded text-sm bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold hover:opacity-95 disabled:opacity-60 transition shadow-md"
                  >
                    {processing?.[r._id] ? "…" : "Accept"}
                  </button>
                  <button
                    onClick={() => rejectRequest(r._id)}
                    disabled={!!processing?.[r._id]}
                    className="px-3 py-1 rounded text-sm border border-gray-300 text-gray-700 hover:bg-red-50 disabled:opacity-60 transition"
                  >
                    {processing?.[r._id] ? "…" : "Reject"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Friends list */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-[rgb(41,22,112)] border-b pb-2">Friends</h3>
        {friends.length === 0 ? (
          <div className="text-sm text-gray-500 py-4">No friends yet — accept some requests!</div>
        ) : (
          friends.map((fr) => (
            <div
              key={`friend-${fr._id}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 transition rounded-lg"
            >
              <div>
                <div className="font-semibold text-gray-800">{fr.username ?? fr.name ?? "User"}</div>
                <div className="text-xs text-gray-500">{fr.email}</div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => startConversationAndGo(fr._id)}
                  className="px-3 py-1 rounded text-sm bg-gradient-to-r from-[rgb(41,22,112)] to-[rgb(196,170,86)] text-white hover:opacity-95 transition shadow-md"
                >
                  Message
                </button>
                <button
                  onClick={() => unfriend(fr._id)}
                  className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}





// // src/components/friends/FriendsManager.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useFriends } from "../../context/FriendsContext";
// import { ensureConversation } from "../../api/messagesService";

// export default function FriendsManager() {
//   const { requests, friends, loading, processing, acceptRequest, rejectRequest, unfriend } = useFriends();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const startConversationAndGo = async (friendId) => {
//     try {
//       const res = await ensureConversation(friendId, token);
//       const convo = res?.conversation ?? res?.data ?? res;
//       const id = convo?._id ?? convo?.id;

//       if (id) {
//         navigate(`/messages?to=${friendId}&c=${id}`);
//       } else {
//         navigate(`/messages?to=${friendId}`);
//       }
//     } catch (err) {
//       console.error("Could not create/open conversation", err);
//       navigate(`/messages?to=${friendId}`);
//     }
//   };

//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Friend Requests */}
//       <div className="bg-white rounded shadow p-4">
//         <h3 className="font-semibold mb-3 text-[rgb(41,22,112)]">Friend Requests</h3>
//         {requests.length === 0 ? (
//           <div className="text-sm text-gray-500">No pending requests</div>
//         ) : (
//           requests.map((r) => {
//             const from = r.from || r.fromUser || {};
//             return (
//               <div
//                 key={`request-${r._id}`}
//                 className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0"
//               >
//                 <div>
//                   <div className="font-medium">{from.name ?? from.username ?? "User"}</div>
//                   <div className="text-xs text-gray-500">{from.email}</div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => acceptRequest(r._id)}
//                     disabled={!!processing?.[r._id]}
//                     className="px-3 py-1 rounded text-sm bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold hover:opacity-95 disabled:opacity-60"
//                   >
//                     {processing?.[r._id] ? "…" : "Accept"}
//                   </button>
//                   <button
//                     onClick={() => rejectRequest(r._id)}
//                     disabled={!!processing?.[r._id]}
//                     className="px-3 py-1 rounded text-sm border hover:bg-gray-50 disabled:opacity-60"
//                   >
//                     {processing?.[r._id] ? "…" : "Reject"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Friends list */}
//       <div className="bg-white rounded shadow p-4">
//         <h3 className="font-semibold mb-3 text-[rgb(41,22,112)]">Friends</h3>
//         {friends.length === 0 ? (
//           <div className="text-sm text-gray-500">No friends yet — accept some requests!</div>
//         ) : (
//           friends.map((fr) => (
//             <div
//               key={`friend-${fr._id}`}
//               className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0"
//             >
//               <div>
//                 <div className="font-medium">{fr.username ?? fr.name ?? "User"}</div>
//                 <div className="text-xs text-gray-500">{fr.email}</div>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => startConversationAndGo(fr._id)}
//                   className="px-3 py-1 rounded text-sm bg-gradient-to-r from-[rgb(41,22,112)] to-[rgb(196,170,86)] text-white hover:opacity-95"
//                 >
//                   Message
//                 </button>
//                 <button
//                   onClick={() => unfriend(fr._id)}
//                   className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

