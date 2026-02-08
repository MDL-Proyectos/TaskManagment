import axios from 'axios'
import { message } from 'antd';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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


api.interceptors.response.use(
  response => response,
    error => {
        if (error.response?.status === 401) {
            message.error('Error en credenciales. Verificá tu usuario y contraseña.');
        }
        else if (error.response?.status === 423) {
            message.error('Usuario con acceso denegado.');
        } else {
            message.error('Ocurrió un error inesperado.');
        }
        return Promise.reject(error);
    }
);

export default api