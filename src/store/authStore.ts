import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: async (credentials) => {
        set({ loading: true });
        try {
          const res = await api.users.login(credentials);
          const { token, user } = res.data.data;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, loading: false });
          toast.success(`Welcome back, ${user.username}`);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Login failed');
          set({ loading: false });
          throw err;
        }
      },
      register: async (data) => {
        set({ loading: true });
        try {
          const res = await api.users.register(data);
          const { token, user } = res.data.data;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, loading: false });
          toast.success('Registration successful');
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Registration failed');
          set({ loading: false });
          throw err;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage'); // optional
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out');
      },
    }),
    { name: 'auth-storage' }
  )
);
