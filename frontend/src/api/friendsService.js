// src/api/friendsService.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://uconnect-backend-2qnn.onrender.com/api/friends",
});

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Correct endpoints
const getFriends = async () => (await API.get("/")).data;
const getRequests = async () => (await API.get("/requests")).data; // 👈 FIXED
const sendRequest = async (userId) => (await API.post(`/request/${userId}`)).data;
const acceptRequest = async (requestId) => (await API.post(`/accept/${requestId}`)).data;
const rejectRequest = async (requestId) => (await API.post(`/reject/${requestId}`)).data;
const unfriend = async (userId) => (await API.delete(`/${userId}`)).data;

const getMessagedFriends = async () => (await API.get("/messaged")).data;

export default {
  getFriends,
  getRequests,
  sendRequest,
  acceptRequest,
  rejectRequest,
  unfriend,
  getMessagedFriends,
};














// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/friends",
// });

// // 🔹 Attach token for every request
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // or sessionStorage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const getFriends = async () => (await API.get("/")).data;
// const getRequests = async () => (await API.get("/requests/incoming")).data;
// const sendRequest = async (userId) => (await API.post(`/request/${userId}`)).data;
// const acceptRequest = async (requestId) => (await API.post(`/accept/${requestId}`)).data;
// const rejectRequest = async (requestId) => (await API.post(`/reject/${requestId}`)).data;
// const unfriend = async (userId) => (await API.delete(`/${userId}`)).data;

// export default { getFriends, getRequests, sendRequest, acceptRequest, rejectRequest, unfriend };
