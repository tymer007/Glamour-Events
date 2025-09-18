import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API Base URL - Update this to match your server
// const API_BASE_URL = 'http://localhost:5000/api'; // Adjust port as needed
const API_BASE_URL = 'https://glamour-events-sever.onrender.com/api'; // Adjust port as needed

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, error: error.message };
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      needsVerification: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Sign Up
      signUp: async (userData) => {
        set({ isLoading: true, error: null });
        
        const { name, email, password, phoneNumber, age, gender } = userData;
        
        if (!name || !email || !password || !phoneNumber || !age || !gender) {
          set({ error: 'All fields are required', isLoading: false });
          return { success: false, error: 'All fields are required' };
        }

        const result = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, phoneNumber, age, gender }),
        });

        if (result.success) {
          set({
            user: result.data.newUser,
            accessToken: result.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            needsVerification: true,
          });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, isLoading: false });
          return { success: false, error: result.error };
        }
      },

      // Sign In
      signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        
        const { email, password } = credentials;
        
        if (!email || !password) {
          set({ error: 'Email and password are required', isLoading: false });
          return { success: false, error: 'Email and password are required' };
        }

        const result = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (result.success) {
          set({
            user: result.data.user,
            accessToken: result.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            needsVerification: false,
          });
          return { success: true, data: result.data };
        } else {
          set({ 
            error: result.error, 
            isLoading: false,
            needsVerification: result.error.includes('verify your email')
          });
          return { success: false, error: result.error };
        }
      },

      // Verify Email
      verifyEmail: async (verificationData) => {
        set({ isLoading: true, error: null });
        
        const { email, code } = verificationData;
        
        if (!email || !code) {
          set({ error: 'Email and verification code are required', isLoading: false });
          return { success: false, error: 'Email and verification code are required' };
        }

        const result = await apiRequest('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ email, code }),
        });

        if (result.success) {
          set({
            user: result.data.user,
            needsVerification: false,
            isLoading: false,
            error: null,
          });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, isLoading: false });
          return { success: false, error: result.error };
        }
      },

      // Resend Verification Code
      resendVerificationCode: async (email) => {
        set({ isLoading: true, error: null });
        
        if (!email) {
          set({ error: 'Email is required', isLoading: false });
          return { success: false, error: 'Email is required' };
        }

        const result = await apiRequest('/auth/resend-verification', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });

        if (result.success) {
          set({ isLoading: false, error: null });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, isLoading: false });
          return { success: false, error: result.error };
        }
      },

      // Sign Out
      signOut: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          needsVerification: false,
        });
      },

      // Get User Profile (if you have this endpoint)
      getUserProfile: async () => {
        const { accessToken } = get();
        
        if (!accessToken) {
          set({ error: 'No access token available' });
          return { success: false, error: 'No access token available' };
        }

        set({ isLoading: true, error: null });

        const result = await apiRequest('/auth/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (result.success) {
          set({ user: result.data.user, isLoading: false, error: null });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, isLoading: false });
          return { success: false, error: result.error };
        }
      },

      // Update User Profile (if you have this endpoint)
      updateProfile: async (updateData) => {
        const { accessToken } = get();
        
        if (!accessToken) {
          set({ error: 'No access token available' });
          return { success: false, error: 'No access token available' };
        }

        set({ isLoading: true, error: null });

        const result = await apiRequest('/auth/profile', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateData),
        });

        if (result.success) {
          set({ user: result.data.user, isLoading: false, error: null });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, isLoading: false });
          return { success: false, error: result.error };
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
