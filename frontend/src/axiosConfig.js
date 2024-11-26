import axios from 'axios';

// Set withCredentials for cross-origin requests (useful if you're working with cookies)
axios.defaults.withCredentials = true;

// Dynamically set the base URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL || 'https://cineverse-fnr5.onrender.com/api/v1/users';  // Fallback to Render URL if no env variable is set

axios.defaults.baseURL = apiUrl;

export default axios;
