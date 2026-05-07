import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosClient = axios.create({baseURL: BASE_URL});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
(res)=> res,
(err)=> {
  if (err.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(err);
}
);

export default axiosClient;