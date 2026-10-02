import axios from 'axios';

const api = axios.create({
  // Vazio = mesma origem (proxy do Vite em dev, a própria API em produção).
  // Defina VITE_API_URL apenas para apontar o front para uma API em outro endereço.
  baseURL: import.meta.env.VITE_API_URL || '',

  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api;
