import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

// Report found item
export const reportFoundItem = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Report lost item
export const reportLostItem = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Search items
export const searchItems = async (query) => {
  const response = await axios.get(`${API_URL}/search`, { params: { q: query } });
  return response.data;
};

// Get ALL items
export const getAllItems = async () => {
  const response = await axios.get(API_URL);
  return response.data.data; // backend wraps in { data: [...] }
};

// Get only found items
export const getFoundItems = async () => {
  const response = await axios.get(`${API_URL}?status=found`);
  return response.data.data; // backend wraps items inside "data"
};


// Get only lost items
export const getLostItems = async () => {
  const response = await axios.get(`${API_URL}?status=lost`);
  return response.data.data;
};



