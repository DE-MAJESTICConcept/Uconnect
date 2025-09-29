// frontend/src/components/friends/FriendRequestsBell.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../../context/useFriends";
import { useToast } from "../../context/ToastContext"; // keep to show local errors if needed

const PlaceholderAvatar = ({ size = 40 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-[rgb(41,22,112)] text-white flex items-center justify-center font-semibold"
  >
    U
  </div>
);

export default function FriendRequestsBell() {
  const { requests = [], loading, accept, reject, processing, load } = useFriends();
  const { show } = useToast?.() ?? {};
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const count = Array.isArray(requests) ? requests.length : 0;

  // Accept and then navigate to messages for the requester (if we have their id)
  const handleAccept = async (id, fromUserId) => {
    try {
      await accept(id);
      // after accepting, if requester id is available, go to messages
      if (fromUserId) {
        // small timeout to allow provider to update state; optional
        setTimeout(() => navigate(`/messages?to=${fromUserId}`), 200);
      }
    } catch (e) {
      console.error("Accept failed", e);
      show?.({ title: "Error", message: "Could not accept request", type: "error" });
    }
  };

  const handleReject = async (id) => {
    try {
      await reject(id);
    } catch (e) {
      console.error("Reject failed", e);
      show?.({ title: "Error", message: "Could not reject request", type: "error" });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative px-3 py-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring"
        title="Friend requests"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span role="img" aria-label="friend-requests" className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 text-[11px] bg-red-600 text-white rounded-full px-1.5 py-0.5">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-lg border z-50">
          <div className="flex items-center justify-between p-3 border-b rounded-t-2xl">
            <div className="text-sm font-semibold text-gray-700">Friend Requests</div>
            <div className="text-xs text-gray-500">{count} pending</div>
          </div>

          <div className="max-h-80 overflow-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Loading…</div>
            ) : count === 0 ? (
              <div className="p-4 text-sm text-gray-500">No incoming requests</div>
            ) : (
              requests.map((r) => {
                const from = r.from || r.fromUser || {};
                const avatar = from?.profile?.avatar;
                const fromId = from?._id || from?.id || null;
                return (
                  <div key={r._id} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={from?.name || "User"} className="w-12 h-12 rounded-full object-cover border" />
                      ) : (
                        <PlaceholderAvatar size={48} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate">
                          <div className="font-medium text-gray-800 truncate">{from?.name || from?.username || "User"}</div>
                          <div className="text-xs text-gray-500 truncate">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</div>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                          <button
                            onClick={() => handleAccept(r._id, fromId)}
                            disabled={!!processing?.[r._id]}
                            className="px-3 py-1.5 text-xs rounded-md bg-[rgb(196,170,86)] text-[rgb(41,22,112)] hover:opacity-95"
                            aria-label={`Accept friend request from ${from?.name || "user"}`}
                          >
                            {processing?.[r._id] ? "…" : "Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(r._id)}
                            disabled={!!processing?.[r._id]}
                            className="px-3 py-1.5 text-xs rounded-md border hover:bg-gray-50"
                            aria-label={`Reject friend request from ${from?.name || "user"}`}
                          >
                            {processing?.[r._id] ? "…" : "Reject"}
                          </button>
                        </div>
                      </div>
                      {from?.profile?.department && (
                        <div className="text-xs text-gray-500 mt-1 truncate">{from.profile.department}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2 border-t rounded-b-2xl text-center">
            <button
              onClick={() => { load(); }}
              className="text-xs text-[rgb(41,22,112)] hover:underline"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
