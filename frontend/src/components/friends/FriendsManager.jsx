// src/components/friends/FriendsManager.jsx
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
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Friend Requests */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3 text-[rgb(41,22,112)]">Friend Requests</h3>
        {requests.length === 0 ? (
          <div className="text-sm text-gray-500">No pending requests</div>
        ) : (
          requests.map((r) => {
            const from = r.from || r.fromUser || {};
            return (
              <div
                key={`request-${r._id}`}
                className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0"
              >
                <div>
                  <div className="font-medium">{from.name ?? from.username ?? "User"}</div>
                  <div className="text-xs text-gray-500">{from.email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(r._id)}
                    disabled={!!processing?.[r._id]}
                    className="px-3 py-1 rounded text-sm bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold hover:opacity-95 disabled:opacity-60"
                  >
                    {processing?.[r._id] ? "…" : "Accept"}
                  </button>
                  <button
                    onClick={() => rejectRequest(r._id)}
                    disabled={!!processing?.[r._id]}
                    className="px-3 py-1 rounded text-sm border hover:bg-gray-50 disabled:opacity-60"
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
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3 text-[rgb(41,22,112)]">Friends</h3>
        {friends.length === 0 ? (
          <div className="text-sm text-gray-500">No friends yet — accept some requests!</div>
        ) : (
          friends.map((fr) => (
            <div
              key={`friend-${fr._id}`}
              className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0"
            >
              <div>
                <div className="font-medium">{fr.username ?? fr.name ?? "User"}</div>
                <div className="text-xs text-gray-500">{fr.email}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startConversationAndGo(fr._id)}
                  className="px-3 py-1 rounded text-sm bg-gradient-to-r from-[rgb(41,22,112)] to-[rgb(196,170,86)] text-white hover:opacity-95"
                >
                  Message
                </button>
                <button
                  onClick={() => unfriend(fr._id)}
                  className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
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


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useFriends } from "../../context/useFriend

// import { ensureConversation } from "../../api/messagesService";

// export default function FriendsManager() {
//   const { requests = [], friends = [], loading, processing, accept, reject, unfriend } = useFriends();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Create or get a conversation, then navigate to messages page.
//   const startConversationAndGo = async (friendId) => {
//     try {
//       const res = await ensureConversation(friendId, token); // ensure token is included
//       const convo = res?.conversation ?? res?.data ?? res;
//       const id = convo?._id ?? convo?.id;

//       // Navigate with both friendId and conversationId in query params
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
//      {requests.length === 0 ? (
//           <div className="text-sm text-gray-500">No pending requests</div>
//         ) : (
//         requests.map(r => {
//   const from = r.from || r.fromUser || {};
//   return (
//     <div key={`request-${r._id}`} className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0">
     
              
//                 <div>
//                   <div className="font-medium">{from.name ?? from.username ?? "User"}</div>
//                   <div className="text-xs text-gray-500">{from.email}</div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => accept(r._id)}
//                     disabled={!!processing?.[r._id]}
//                     className="px-3 py-1 rounded text-sm bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold hover:opacity-95 disabled:opacity-60"
//                   >
//                     {processing?.[r._id] ? "…" : "Accept"}
//                   </button>
//                   <button
//                     onClick={() => reject(r._id)}
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
//          friends.map(fr => (
//   <div key={`friend-${fr._id}`} className="flex items-center justify-between gap-3 p-2 border-b last:border-b-0">
  
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
