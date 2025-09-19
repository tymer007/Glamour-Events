import { create } from 'zustand';
import { toast } from '../utils/toast';

// API Base URL
const API_BASE_URL = 'https://glamour-events-sever.onrender.com/api';

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

const useEventStore = create((set, get) => ({
  // State
  events: [],
  upcomingEvents: [],
  pastEvents: [],
  currentEvent: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Create Event
  createEvent: async (eventData, accessToken) => {
    set({ isLoading: true, error: null });

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('location', eventData.location);
    formData.append('category', eventData.category);
    
    if (eventData.banner) {
      formData.append('banner', eventData.banner);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        set({ isLoading: false, error: null });
        toast.success('Event created successfully!');
        return { success: true, data };
      } else {
        set({ error: data.message || 'Failed to create event', isLoading: false });
        toast.error(data.message || 'Failed to create event');
        return { success: false, error: data.message || 'Failed to create event' };
      }
    } catch (error) {
      set({ error: 'Network error. Please try again.', isLoading: false });
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Get All Events
  getEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });

    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);

    const result = await apiRequest(`/events?${queryParams.toString()}`);

    if (result.success) {
      set({ events: result.data.data, isLoading: false, error: null });
      return { success: true, data: result.data.data };
    } else {
      set({ error: result.error, isLoading: false });
      return { success: false, error: result.error };
    }
  },

  // Get Single Event
  getEvent: async (eventId) => {
    set({ isLoading: true, error: null });

    const result = await apiRequest(`/events/${eventId}`);

    if (result.success) {
      set({ currentEvent: result.data.data, isLoading: false, error: null });
      return { success: true, data: result.data.data };
    } else {
      set({ error: result.error, isLoading: false });
      return { success: false, error: result.error };
    }
  },

  // Update Event
  updateEvent: async (eventId, eventData, accessToken) => {
    set({ isLoading: true, error: null });

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('location', eventData.location);
    formData.append('category', eventData.category);
    
    if (eventData.banner) {
      formData.append('banner', eventData.banner);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        set({ isLoading: false, error: null });
        return { success: true, data };
      } else {
        set({ error: data.message || 'Failed to update event', isLoading: false });
        return { success: false, error: data.message || 'Failed to update event' };
      }
    } catch (error) {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Delete Event
  deleteEvent: async (eventId, accessToken) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ isLoading: false, error: null });
        return { success: true, data };
      } else {
        set({ error: data.message || 'Failed to delete event', isLoading: false });
        return { success: false, error: data.message || 'Failed to delete event' };
      }
    } catch (error) {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Get Upcoming Events
  getUpcomingEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });

    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const result = await apiRequest(`/events/upcoming?${queryParams.toString()}`);

    if (result.success) {
      set({ upcomingEvents: result.data.data, isLoading: false, error: null });
      return { success: true, data: result.data.data };
    } else {
      set({ error: result.error, isLoading: false });
      return { success: false, error: result.error };
    }
  },

  // Get Past Events
  getPastEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });

    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const result = await apiRequest(`/events/past?${queryParams.toString()}`);

    if (result.success) {
      set({ pastEvents: result.data.data, isLoading: false, error: null });
      return { success: true, data: result.data.data };
    } else {
      set({ error: result.error, isLoading: false });
      return { success: false, error: result.error };
    }
  },

  // Get Event Statistics
  getEventStats: async (eventId) => {
    set({ isLoading: true, error: null });

    try {
      const [ratingsResult, avgResult] = await Promise.all([
        apiRequest(`/events/${eventId}/ratings-distribution`),
        apiRequest(`/events/${eventId}/average-rating`)
      ]);

      if (ratingsResult.success && avgResult.success) {
        set({ isLoading: false, error: null });
        return { 
          success: true, 
          data: {
            ratingsDistribution: ratingsResult.data.data,
            averageRating: avgResult.data.data
          }
        };
      } else {
        set({ error: 'Failed to fetch event statistics', isLoading: false });
        return { success: false, error: 'Failed to fetch event statistics' };
      }
    } catch (error) {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Get Admin Dashboard Data
  getAdminData: async (accessToken) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ isLoading: false, error: null });
        return { success: true, data: data.data };
      } else {
        set({ error: data.message || 'Failed to fetch admin data', isLoading: false });
        return { success: false, error: data.message || 'Failed to fetch admin data' };
      }
    } catch (error) {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },
}));

export default useEventStore;
