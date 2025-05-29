import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 1000 * 15, // 15 sec
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
     const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => Promise.reject(error) 
)
/*
api.interceptors.response.use(
  (response) => response.data, // Do something with response data
  (error) =>
    // Do something with response error
    Promise.reject(console.log(error))
)*/

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api