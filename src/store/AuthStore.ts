import { create } from 'zustand';
import axios from 'axios';
import { loadUserData, saveUserData } from './localStorage';
import {
  clearAllTokens,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
} from './secureStore';
import { User } from '../types/user';

interface AuthState {
  authToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initializeAuth: () => Promise<void>;
  login: (authToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  needsProfileCreation: true,

  /**
   * Initialize authentication state by retrieving tokens and user data from Keychain
   */
  async initializeAuth() {
    try {
      const [authToken, refreshToken, user] = await Promise.all([
        getAuthToken(),
        getRefreshToken(),
        loadUserData(),
      ]);

      if (authToken && refreshToken && user) {
        set({
          authToken,
          refreshToken,
          user,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth state', error);
      set({ loading: false });
    }
  },

  /**
   * Login action to set user data and tokens
   */
  async login(authToken: string, refreshToken: string, user: User) {
    try {
      await Promise.all([
        setAuthToken(authToken),
        setRefreshToken(refreshToken),
        saveUserData(user),
      ]);
      set({
        authToken,
        refreshToken,
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  /**
   * Logout action to clear user data and tokens
   */
  async logout() {
    try {
      await clearAllTokens();

      set({
        authToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  },

  /**
   * Refresh authentication token using the refresh token
   */
  async refreshAuthToken() {
    const { refreshToken } = get();
    if (!refreshToken) {
      console.warn('No refresh token available');
      await get().logout();
      return;
    }

    try {
      const response = await axios.post('https://your-api.com/auth/refresh', {
        refreshToken,
      });

      if (response.status === 200) {
        const { authToken: newAuthToken, refreshToken: newRefreshToken } =
          response.data;

        await Promise.all([
          setAuthToken(newAuthToken),
          setRefreshToken(newRefreshToken),
        ]);

        set({
          authToken: newAuthToken,
          refreshToken: newRefreshToken,
        });
      } else {
        console.error('Failed to refresh auth token');
        await get().logout();
      }
    } catch (error) {
      console.error('Error refreshing auth token', error);
      await get().logout();
    }
  },
}));
