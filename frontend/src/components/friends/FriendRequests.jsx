// src/components/friends/FriendRequests.jsx
import React from "react";
import { useFriends } from "../../context/FriendsContext";

export default function FriendRequests() {
  const { requests, acceptRequest, rejectRequest, processing, loading } = useFriends();

  if (loading) return <p>Loading requests...</p>;
  if (!requests.length) return <p>No friend requests</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Friend Requests</h2>
      <ul className="space-y-2">
        {requests.map((req) => {
          const id = req._id;
          const isProcessing = processing[id];

          return (
            <li
              key={id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <span>{req.from?.name ?? req.name ?? "Unknown"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(id)}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                >
                  {isProcessing ? "Accepting..." : "Accept"}
                </button>
                <button
                  onClick={() => rejectRequest(id)}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                >
                  {isProcessing ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}








// // frontend/src/components/friends/FriendRequests.js
// import React from "react";
// import { useFriends } from "../../context/useFriends";


// function FriendRequests() {
//   const { requests = [], loading, processing, accept, reject } = useFriends();

//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-3">Friend Requests</h2>
//       {requests.length === 0 ? (
//         <p className="text-sm text-gray-500">No pending requests</p>
//       ) : (
//         requests.map(req => {
//           const from = req.from || req.fromUser || {};
//           return (
//             <div key={req._id} className="flex items-center justify-between border p-2 rounded mb-2">
//               <div>
//                 <div className="font-medium">{from.username ?? from.name ?? "User"}</div>
//                 <div className="text-xs text-gray-500">{from.email}</div>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                   onClick={() => accept(req._id)}
//                   disabled={!!processing?.[req._id]}
//                 >
//                   {processing?.[req._id] ? "…" : "Accept"}
//                 </button>
//                 <button
//                   className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//                   onClick={() => reject(req._id)}
//                   disabled={!!processing?.[req._id]}
//                 >
//                   Decline
//                 </button>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }

// export default FriendRequests;
