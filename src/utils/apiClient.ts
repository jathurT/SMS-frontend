import axios from 'axios';
import keycloak from '../config/keycloak';

// Get API URL from environment
const apiUrl = import.meta.env.VITE_APP_API_URL;
if (!apiUrl) {
  throw new Error('VITE_APP_API_URL environment variable is not set');
}

// Create axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add token if available
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
      console.log('Adding Authorization header to request:', config.url);
    } else {
      console.warn('No Keycloak token available for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - attempting token refresh');
      
      try {
        // Try to refresh token
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          console.log('Token refreshed successfully, retrying request');
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${keycloak.token}`;
          return apiClient.request(error.config);
        } else {
          console.log('Token refresh not needed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        keycloak.login();
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;