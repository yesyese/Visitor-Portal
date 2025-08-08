// API Service for Foreign Visitor Portal
// Centralized API calls and configuration

const API_BASE_URL = 'https://ssp-backend-1ovl.onrender.com';

// API configuration
const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic API call function with error handling
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...apiConfig,
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    return apiCall('/foreign-users/register', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        mobile_no: userData.mobile_no,
        passport_number: userData.passport_number,
        nationality: userData.nationality,
        passport_validity: userData.passport_validity
      }),
    });
  },
    verifyOTP: async (email, otp) => {

    return apiCall('/foreign-users/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

  },
  setPassword: async (email, password) => {
    return apiCall('/foreign-users/set-password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  login: async (credentials) => {
    return apiCall('/foreign-users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  getCurrentUser: async () => {
    // Get token from localStorage as backup
    const token = localStorage.getItem('userToken');
    console.log('Token from localStorage:', token ? 'exists' : 'missing');
    console.log('ApiConfig headers:', apiConfig.headers);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    return apiCall('/foreign-users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
  },
};

// Form C APIs
export const formCAPI = {
  // Submit Visitor Registration (Form C) application
  submitApplication: async (applicationData) => {
    // === UPDATED ENDPOINT ===
    return apiCall('/visitor-registrations', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },
 
};

// User Profile APIs
export const userAPI = {
  getProfile: async () => {
    return apiCall(`/users/profile`, { // Assumes backend gets user from token
      method: 'GET',
    });
  },
  updateProfile: async (profileData) => {
    return apiCall(`/users/profile`, { // Assumes backend gets user from token
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  getDashboardData: async () => {
    return apiCall(`/users/dashboard`, { // Assumes backend gets user from token
      method: 'GET',
    });
  },
};

// Notifications APIs
export const notificationAPI = {
  getNotifications: async () => {
    return apiCall(`/notifications`, { // Assumes backend gets user from token
      method: 'GET',
    });
  },
  markAsRead: async (notificationId) => {
    return apiCall(`/notifications/read/${notificationId}`, {
      method: 'PUT',
    });
  },
  markAllAsRead: async () => {
    return apiCall(`/notifications/read-all`, { // Assumes backend gets user from token
      method: 'PUT',
    });
  },
  deleteNotification: async (notificationId) => {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

// District Information APIs
export const districtAPI = {
  getInfo: async () => {
      // A single endpoint to get all relatively static district info
      return apiCall('/district/info', {
          method: 'GET',
      });
  },
};

// Help & Support APIs
export const supportAPI = {
  submitComplaint: async (complaintData) => {
    // Get token from localStorage
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    // Only send { Subject: ... }
    return apiCall('/complaint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ Subject: complaintData.Subject }),
    });
  },
  getFAQ: async () => {
    return apiCall('/support/faq', {
      method: 'GET',
    });
  },
  contactSupport: async (contactData) => {
    return apiCall('/support/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// === NEW: Chatbot API ===
export const chatbotAPI = {
    sendMessage: async (message) => {
        return apiCall('/chatbot', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    },
};

// File Upload APIs
export const fileAPI = {
  uploadFile: async (file, type = 'document') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiCall('/files/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },
  downloadFile: async (fileId) => {
    return apiCall(`/files/download/${fileId}`, {
      method: 'GET',
    });
  },
  deleteFile: async (fileId) => {
    return apiCall(`/files/${fileId}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions for handling auth tokens
export const apiUtils = {
  setAuthToken: (token) => {
    if (token) {
        apiConfig.headers.Authorization = `Bearer ${token}`;
    } else {
        delete apiConfig.headers.Authorization;
    }
  },
  removeAuthToken: () => {
    delete apiConfig.headers.Authorization;
  },
  isAuthenticated: () => {
    return !!apiConfig.headers.Authorization;
  },
  getToken: () => {
    return apiConfig.headers.Authorization?.replace('Bearer ', '');
  },
  initializeAuth: () => {
    // Initialize auth token from localStorage when app loads
    const token = localStorage.getItem('userToken');
    console.log('Initializing auth, token found:', token ? 'yes' : 'no');
    if (token) {
      apiConfig.headers.Authorization = `Bearer ${token}`;
      console.log('Auth header set in apiConfig');
    }
  },
};

// Centralized export
const apiService = {
  auth: authAPI,
  formC: formCAPI,
  user: userAPI,
  notifications: notificationAPI,
  district: districtAPI,
  support: supportAPI,
  chatbot: chatbotAPI, // Added chatbot API here
  files: fileAPI,
  utils: apiUtils,
};

// Initialize authentication on app load
apiUtils.initializeAuth();

export default apiService;
