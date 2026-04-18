import axios from 'axios';
import { storage } from '../utils/storage';
import { API_BASE } from '../utils/constants';   

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

api.interceptors.request.use(config => { 
  const token = storage.getToken(); 
  if (token) config.headers.Authorization = `Bearer ${token}`; 
  return config; 
});

api.interceptors.response.use(response => response, error => { 
  if (error.response?.status === 401) { 
    storage.clear(); 
    window.location.href = '/login'; 
  } 
  return Promise.reject(error); 
});

export default {
  users: {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data)
  },
  quizzes: {
    getAll: (params) => api.get('/quizzes', { params }),
    getById: (id) => api.get(`/quizzes/${id}`),
    create: (data) => api.post('/quizzes', data),
    update: (id, data) => api.put(`/quizzes/${id}`, data),
    delete: (id) => api.delete(`/quizzes/${id}`)
  },
  results: {
    submit: (data) => api.post('/results', data),
    getUserResults: () => api.get('/results/my-results'),
    getAllResults: () => api.get('/results/admin/all'),
    getLeaderboard: () => api.get('/results/leaderboard'),
    getById: (id) => api.get(`/results/${id}`)
  }
};
