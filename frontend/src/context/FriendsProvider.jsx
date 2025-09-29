// src/context/FriendsProvider.jsx
import React, { useState, useCallback, useEffect } from "react";
import FriendsContext from "./FriendsContext";
import friendsService from "../api/friendsService";
import { useToast } from "./ToastContext"; // optional

export default function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const { show } = useToast?.() ?? {}; // optional toast

  // ✅ Central loader – no over-complication
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [frRes, reqRes] = await Promise.all([
        friendsService.getFriends(),      // { friends: [...] }
        friendsService.getRequests(),     // { requests: [...] }
      ]);

      const friendList = frRes?.friends ?? [];
      const requestList = reqRes?.requests ?? [];

      // remove duplicates (friend already accepted shouldn’t stay in requests)
      const filteredRequests = requestList.filter(
        (r) => !friendList.some((f) => String(f._id) === String(r.from?._id || r._id))
      );

      setFriends(friendList);
      setRequests(filteredRequests);
    } catch (err) {
      console.error("Friends load failed", err);
      show?.({ title: "Error", message: "Could not load friends", type: "error" });
      setFriends([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    load();
  }, [load]);

  // action helpers
  const setBusy = (id) => setProcessing((p) => ({ ...p, [id]: true }));
  const clearBusy = (id) => setProcessing((p) => ({ ...p, [id]: false }));

  const sendRequest = useCallback(async (userId) => {
    setBusy(userId);
    try {
      await friendsService.sendRequest(userId);
      await load();
      show?.({ title: "Request sent", type: "success" });
    } catch (err) {
      console.error("sendRequest error", err);
      show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not send request", type: "error" });
    } finally {
      clearBusy(userId);
    }
  }, [load, show]);

  const acceptRequest = useCallback(async (requestId) => {
    setBusy(requestId);
    try {
      await friendsService.acceptRequest(requestId);
      await load();
      show?.({ title: "Friend added", type: "success" });
    } catch (err) {
      console.error("acceptRequest error", err);
      show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not accept", type: "error" });
    } finally {
      clearBusy(requestId);
    }
  }, [load, show]);

  const rejectRequest = useCallback(async (requestId) => {
    setBusy(requestId);
    try {
      await friendsService.rejectRequest(requestId);
      await load();
      show?.({ title: "Request rejected", type: "warning" });
    } catch (err) {
      console.error("rejectRequest error", err);
      show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not reject", type: "error" });
    } finally {
      clearBusy(requestId);
    }
  }, [load, show]);

  const unfriend = useCallback(async (userId) => {
    setBusy(userId);
    try {
      await friendsService.unfriend(userId);
      await load();
      show?.({ title: "Removed", type: "info" });
    } catch (err) {
      console.error("unfriend error", err);
      show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not remove", type: "error" });
    } finally {
      clearBusy(userId);
    }
  }, [load, show]);

  const value = {
    friends,
    requests,
    loading,
    processing,
    sendRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
    refresh: load,
  };

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}






// import React, { useState, useCallback, useEffect } from "react";
// import FriendsContext from "./FriendsContext";
// import friendsService from "../api/friendsService";
// import { initSocket, getSocket, disconnectSocket } from "../socket";
// import { useToast } from "./ToastContext";

// export function FriendsProvider({ children }) {
//   const [requests, setRequests] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState({});
//   const { show } = useToast();

//   const token = localStorage.getItem("token");

//   // Normalize API response arrays
//   const normalizeList = (v) => {
//     if (!v && v !== 0) return [];
//     if (Array.isArray(v)) return v;
//     if (v?.friends && Array.isArray(v.friends)) return v.friends;
//     if (v?.data && Array.isArray(v.data)) return v.data;
//     if (v?.data?.friends && Array.isArray(v.data.friends)) return v.data.friends;
//     if (v?.users && Array.isArray(v.users)) return v.users;
//     if (v?.docs && Array.isArray(v.docs)) return v.docs;
//     const firstArray = Object.values(v || {}).find(Array.isArray);
//     return Array.isArray(firstArray) ? firstArray : [];
//   };

//   const load = useCallback(async () => {
//     if (!token) {
//       show?.({ title: "Error", message: "Not logged in", type: "error" });
//       setRequests([]);
//       setFriends([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const reqRes = await friendsService.getRequests(token);
//       const frRes = await friendsService.getFriends(token);

//       const reqList = normalizeList(reqRes);
//       const frList = normalizeList(frRes);

//       setRequests(reqList);
//       setFriends(frList);
//     } catch (err) {
//       console.error("Friends load failed", err);
//       show?.({ title: "Error", message: "Could not load friends", type: "error" });
//       setRequests([]);
//       setFriends([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [token, show]);

//   const accept = useCallback(async (requestId) => {
//     if (!token) return;
//     setProcessing((p) => ({ ...p, [requestId]: true }));
//     const prevRequests = requests;
//     setRequests((r) => r.filter((x) => String(x._id) !== String(requestId)));

//     try {
//       const res = await friendsService.acceptRequest(requestId, token);
//       const friend = res?.friend ?? res?.data ?? res;
//       if (friend) setFriends((f) => [friend, ...f]);
//       else await load();
//       show?.({ title: "Friend added", message: "You are now friends.", type: "success" });
//     } catch (err) {
//       console.error("Accept failed", err);
//       setRequests(prevRequests);
//       show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not accept request", type: "error" });
//     } finally {
//       setProcessing((p) => ({ ...p, [requestId]: false }));
//     }
//   }, [requests, token, show, load]);

//   const reject = useCallback(async (requestId) => {
//     if (!token) return;
//     setProcessing((p) => ({ ...p, [requestId]: true }));
//     const prevRequests = requests;
//     setRequests((r) => r.filter((x) => String(x._id) !== String(requestId)));

//     try {
//       await friendsService.rejectRequest(requestId, token);
//       show?.({ title: "Request rejected", message: "You declined the request.", type: "warning" });
//     } catch (err) {
//       console.error("Reject failed", err);
//       setRequests(prevRequests);
//       show?.({ title: "Error", message: err?.response?.data?.message ?? "Could not reject request", type: "error" });
//     } finally {
//       setProcessing((p) => ({ ...p, [requestId]: false }));
//     }
//   }, [requests, token, show]);

//   const unfriend = useCallback(async (userId) => {
//     if (!token) return;
//     const prev = friends;
//     setFriends((f) => f.filter((x) => String(x._id) !== String(userId)));

//     try {
//       await friendsService.unfriend(userId, token);
//       show?.({ title: "Removed", message: "Friend removed.", type: "info" });
//     } catch (err) {
//       console.error("Unfriend failed", err);
//       setFriends(prev);
//       show?.({ title: "Error", message: "Could not remove friend", type: "error" });
//     }
//   }, [friends, token, show]);

//   // Socket listeners
//   useEffect(() => {
//     const s = initSocket();
//     if (!s) return;

//     const onNew = (payload) => {
//       try {
//         const req = payload?.request;
//         if (req) {
//           setRequests((prev) => [req, ...prev]);
//           show?.({ title: "Friend request", message: "You received a new friend request", type: "info" });
//         } else {
//           load();
//         }
//       } catch (err) {
//         console.error("Socket onNew error", err);
//         load();
//       }
//     };

//     const reload = () => load();

//     s.on("friend:request:received", onNew);
//     s.on("friend:accepted", reload);
//     s.on("friend:rejected", reload);
//     s.on("friend:removed", reload);

//     return () => {
//       s.off("friend:request:received", onNew);
//       s.off("friend:accepted", reload);
//       s.off("friend:rejected", reload);
//       s.off("friend:removed", reload);
//       disconnectSocket();
//     };
//   }, [load, show]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const value = { requests, friends, loading, processing, load, accept, reject, unfriend };
//   return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
// }

// export default FriendsProvider;
