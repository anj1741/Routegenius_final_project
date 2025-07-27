// src/services/api.js
const API_BASE_URL = 'http://localhost:8081/api/v1'; // Ensure this matches your backend port

const makeRequest = async (url, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    console.log(`Frontend DEBUG: Making ${method} request to ${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    console.log(`Frontend DEBUG: Received response for ${url}. Status: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      return responseData;
    } else if (response.ok) {
      // Handle cases where response is OK but not JSON (e.g., 204 No Content)
      return {}; 
    } else {
      let errorData = {};
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() || `API Error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Frontend ERROR: Error making ${method} request to ${url}:`, error);
    throw error;
  }
};

// --- Authentication API Calls (AuthController) ---
export const loginUser = async (email, password) => {
  return makeRequest('/auth/login', 'POST', { email, password });
};

export const registerUser = async (userData) => {
  return makeRequest('/auth/register', 'POST', userData);
};

export const loginAdmin = async (email, password) => {
  return makeRequest('/auth/login', 'POST', { email, password });
};

// --- Admin-specific API Calls (AdminController) ---
export const getAllUsers = async (token) => {
  return makeRequest('/admin/users', 'GET', null, token);
};

export const createUser = async (userData, token) => {
  return makeRequest('/admin/users', 'POST', userData, token);
};

export const updateUser = async (userId, userData, token) => {
  return makeRequest(`/admin/users/${userId}`, 'PUT', userData, token);
};

export const deleteUser = async (userId, token) => {
  return makeRequest(`/admin/users/${userId}`, 'DELETE', null, token);
};

// --- Parcel Management & Tracking API Calls (ParcelController) ---
export const getAllParcels = async (token) => {
  return makeRequest('/parcels', 'GET', null, token);
};

export const addParcel = async (parcelData, token) => {
  return makeRequest('/parcels', 'POST', parcelData, token);
};

export const updateParcel = async (parcelId, updatedData, token) => {
  return makeRequest(`/parcels/${parcelId}`, 'PUT', updatedData, token);
};

export const deleteParcel = async (parcelId, token) => {
  return makeRequest(`/parcels/${parcelId}`, 'DELETE', null, token);
};

export const trackParcel = async (trackingId) => {
  return makeRequest(`/parcels/track/${trackingId}`, 'GET');
};

export const getUserParcels = async (userId, token) => {
  return makeRequest(`/parcels/my-parcels/${userId}`, 'GET', null, token); // <<< CRUCIAL CHANGE HERE
};

// --- Notification API Calls (NotificationController) ---
export const getUserNotifications = async (token) => {
  // This is the crucial line: it only takes the token.
  return makeRequest('/notifications', 'GET', null, token);
};

export const markNotificationAsRead = async (notificationId, token) => {
  return makeRequest(`/notifications/${notificationId}/read`, 'PUT', null, token);
};

export const deleteNotification = async (notificationId, token) => {
  return makeRequest(`/notifications/${notificationId}`, 'DELETE', null, token);
};

export const generateNotificationDraft = async (parcelId, status, token) => {
  return makeRequest('/notifications/generate-draft', 'POST', { parcelId, status }, token);
};
