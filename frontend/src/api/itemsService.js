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
  const response = await axios.get(`${API_URL}/found`);
  return response.data.data;
};

// Get only lost items
export const getLostItems = async () => {
  const response = await axios.get(`${API_URL}/lost`);
  return response.data.data;
};





// const API_URL = 'http://localhost:5000/api';

// // Helper function to handle API responses
// export const handleResponse = async (response) => {
//   const contentType = response.headers.get('content-type');
//   const isJson = contentType && contentType.includes('application/json');
//   const data = isJson ? await response.json() : await response.text();
  
//   if (!response.ok) {
//     const error = new Error(isJson ? (data.message || response.statusText) : data);
//     error.status = response.status;
//     error.data = data;
//     throw error;
//   }
  
//   return data;
// };

// /**
//  * Report a found item
//  * @param {FormData} formData - Form data containing item details and image
//  * @returns {Promise} Response from the server
//  */
// export const reportFoundItem = async (formData) => {
//   try {
//     console.log('Sending request to:', `${API_URL}/items`);
//     console.log('Form data entries:');
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }
    
//     const response = await fetch(`${API_URL}/items`, {
//       method: 'POST',
//       body: formData,
//       // Don't set Content-Type header, let the browser set it with the correct boundary
//       credentials: 'include', // Include cookies if needed
//       headers: {}
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Error reporting found item:', error);
//     if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//       throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
//     }
//     throw error;
//   }
// };

// /**
//  * Report a lost item
//  * @param {FormData} formData - Form data containing item details and image
//  * @returns {Promise} Response from the server
//  */
// export const reportLostItem = async (formData) => {
//   try {
//     console.log('Sending request to:', `${API_URL}/items`);
//     console.log('Form data entries:');
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }
    
//     const response = await fetch(`${API_URL}/items`, {
//       method: 'POST',
//       body: formData,
//       // Don't set Content-Type header, let the browser set it with the correct boundary
//       credentials: 'include', // Include cookies if needed
//       headers: {}
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Error reporting lost item:', error);
//     if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//       throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
//     }
//     throw error;
//   }
// };

// /**
//  * Get all found items
//  * @returns {Promise} List of found items
//  */
// export const getFoundItems = async () => {
//   try {
//     const response = await fetch(`${API_URL}/items?status=found`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch found items');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching found items:', error);
//     throw error;
//   }
// };

// /**
//  * Get recent items (lost/found)
//  * @returns {Promise} List of recent items
//  */
// export const getRecentItems = async () => {
//   try {
//     const response = await fetch(`${API_URL}/items/recent`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch recent items');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching recent items:', error);
//     throw error;
//   }
// };


// /**
//  * Get all lost items
//  * @returns {Promise} List of lost items
//  */
// export const getLostItems = async () => {
//   try {
//     const response = await fetch(`${API_URL}/items?status=lost`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch lost items');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching lost items:', error);
//     throw error;
//   }
// };

// /**
//  * Search for items by query
//  * @param {string} query - Search query
//  * @param {string} status - Item status (default: 'found')
//  * @returns {Promise} Search results
//  */
// export const searchItems = async (query, status = 'found') => {
//   try {
//     const response = await fetch(
//       `${API_URL}/items/search?q=${encodeURIComponent(query)}&status=${status}`
//     );
//     const data = await handleResponse(response);
//     return data.data; // return ONLY the array
//   } catch (error) {
//     console.error('Error searching items:', error);
//     throw error;
//   }
// };


// export default {
//   reportFoundItem,
//   reportLostItem,
//   getFoundItems,
//   getLostItems,
//   searchItems,
// };
