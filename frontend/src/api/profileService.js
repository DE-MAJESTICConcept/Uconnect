import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://uconnect-backend-2qnn.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyProfile = async () => {
  const { data } = await api.get("/profile/me");
  return data;
};

export const getProfileById = async (id) => {
  const { data } = await api.get(`/profile/${id}`);
  return data;
};

export const updateMyProfile = async (payload) => {
  let formData;
  if (payload instanceof FormData) {
    formData = payload;
  } else {
    formData = new FormData();
    const fields = ["name", "department", "year", "matricNumber", "staffId", "bio"];
    fields.forEach((k) => {
      if (payload[k] !== undefined && payload[k] !== null) {
        formData.append(k, payload[k]);
      }
    });
    if (payload.avatar instanceof File || payload.avatar instanceof Blob) {
      formData.append("avatar", payload.avatar);
    }
    if (payload.cover instanceof File || payload.cover instanceof Blob) {
      formData.append("cover", payload.cover);
    }
  }

  // 🔑 Get token from localStorage
  const token = localStorage.getItem("token");

  // 🟢 Put Authorization header here
  const { data } = await api.put("/profile/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,   // <--- HERE
    },
  });

  return data;
};


export const getMutualFriends = async (id) => {
  const { data } = await api.get(`/profile/${id}/mutual`);
  return data; // { mutuals: [...], count: number }
};
// ✅ NEW: Get all user profiles (Admin feature)
export const getAllProfile = async () => {
  const { data } = await api.get("/profile");
  return data; // expect array of users
};
export const discoverPeople = async () => {
  const { data } = await api.get("/users/discover");
  return data;
};

export default { getMyProfile, getProfileById, updateMyProfile, getMutualFriends, getAllProfile, discoverPeople };


