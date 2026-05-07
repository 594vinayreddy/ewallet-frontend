// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
token: string | null;
setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('jwt_token'),
  setToken: (token) => {
    localStorage.setItem('jwt_token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ token: null });
  },
}));