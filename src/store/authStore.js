import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authAPI } from '../api/client';
import {
  setTokenInStorage,
  removeTokenFromStorage,
  getTokenFromStorage,
  isTokenValid,
  parseToken,
} from '../utils/jwt';

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { token, user } = await authAPI.login(email, password);
            setTokenInStorage(token);
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } catch (err) {
            set({
              isLoading: false,
              error: err.message,
              isAuthenticated: false,
            });
            return { success: false, error: err.message };
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authAPI.logout();
          } finally {
            removeTokenFromStorage();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        clearError: () => set({ error: null }),

        initAuth: () => {
          const token = getTokenFromStorage();
          if (token && isTokenValid(token)) {
            const payload = parseToken(token);
            set({
              token,
              isAuthenticated: true,
              user: {
                id: payload.userId,
                email: payload.email,
                name: payload.name,
              },
            });
          } else {
            removeTokenFromStorage();
            set({ token: null, isAuthenticated: false, user: null });
          }
        },
      }),
      {
        name: 'taskflow-auth',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);

export default useAuthStore;
