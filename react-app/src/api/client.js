// import axios from 'axios';

// // Use a base URL that works with your development setup
// const API_URL = 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // or your backend URL
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

