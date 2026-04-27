import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../utils/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.registerUser(data);
          set({
            user: res.data.user,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Registration failed',
            loading: false,
          });
          return { success: false, error: err.response?.data?.message };
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.loginUser(data);
          set({
            user: res.data.user,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false,
          });
          return { success: false, error: err.response?.data?.message };
        }
      },

      logout: async () => {
        try {
          await api.logoutUser();
        } catch (err) {
          console.log(err);
        }
        set({ user: null, isAuthenticated: false });
      },

      getMe: async () => {
        try {
          const res = await api.getMe();
          set({ user: res.data.user, isAuthenticated: true });
        } catch (err) {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const res = await api.updateProfile(data);
          set({ user: res.data.user, loading: false });
          return { success: true };
        } catch (err) {
          set({ loading: false });
          return { success: false, error: err.response?.data?.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;