import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  users: {
    register: (data: any) => api.post('/users/register', data),
    login: (data: any) => api.post('/users/login', data),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
  },
  quizzes: {
    getAll: (params?: any) => api.get('/quizzes', { params }),
    getById: (id: string) => api.get(`/quizzes/${id}`),
    create: (data: any) => api.post('/quizzes', data),
    update: (id: string, data: any) => api.put(`/quizzes/${id}`, data),
    delete: (id: string) => api.delete(`/quizzes/${id}`),
  },
  results: {
    submit: (data: any) => api.post('/results', data),
    getUserResults: () => api.get('/results/my-results'),
    getAllResults: () => api.get('/results'),          // ✅ fixed (was /admin/all)
    getLeaderboard: () => api.get('/results/leaderboard'),
    getById: (id: string) => api.get(`/results/${id}`),
  },
};

export default apiService;