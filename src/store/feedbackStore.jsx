import { create } from 'zustand';
import { toast } from '../utils/toast';

// API Base URL - Update this to match your server

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

const useFeedbackStore = create((set, get) => ({
  // State
  reviews: [],
  isLoading: false,
  error: null,
  pagination: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Get reviews for an event
  getEventReviews: async (eventId, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    
    const result = await apiRequest(`/events/${eventId}/feedback?page=${page}&limit=${limit}`);
    
    if (result.success) {
      set({ 
        reviews: result.data.data, 
        pagination: result.data.pagination,
        isLoading: false, 
        error: null 
      });
      return { success: true, data: result.data };
    } else {
      set({ error: result.error, isLoading: false });
      return { success: false, error: result.error };
    }
  },

  // Create a review
  createReview: async (eventId, reviewData) => {
    set({ isLoading: true, error: null });
    
    const { 
      ratings, 
      comments, 
      recommendation, 
      photos, 
      isAnonymous, 
      anonymousName,
      demographics,
      isPublic = true
    } = reviewData;
    
    if (!ratings?.overall || ratings.overall < 1 || ratings.overall > 5) {
      set({ error: 'Overall rating must be between 1 and 5', isLoading: false });
      return { success: false, error: 'Overall rating must be between 1 and 5' };
    }

    if (recommendation === undefined) {
      set({ error: 'Recommendation is required', isLoading: false });
      return { success: false, error: 'Recommendation is required' };
    }

    if (isAnonymous && !anonymousName) {
      set({ error: 'Anonymous name is required when submitting anonymously', isLoading: false });
      return { success: false, error: 'Anonymous name is required when submitting anonymously' };
    }

    const result = await apiRequest(`/events/${eventId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({
        ratings,
        comments,
        recommendation: Boolean(recommendation),
        photos: photos || [],
        isAnonymous: Boolean(isAnonymous),
        anonymousName: isAnonymous ? (anonymousName || 'Anonymous') : undefined,
        demographics,
        isPublic: Boolean(isPublic),
      }),
    });

    if (result.success) {
      // Add the new review to the current list
      const currentReviews = get().reviews;
      set({ 
        reviews: [result.data.data, ...currentReviews],
        isLoading: false, 
        error: null 
      });
      toast.success('Review submitted successfully!');
      return { success: true, data: result.data };
    } else {
      set({ error: result.error, isLoading: false });
      toast.error(result.error);
      return { success: false, error: result.error };
    }
  },

  // Update a review
  updateReview: async (reviewId, updateData) => {
    set({ isLoading: true, error: null });
    
    const { 
      ratings, 
      reviews, 
      recommendation, 
      photos, 
      isPublic,
      demographics 
    } = updateData;
    
    if (ratings?.overall && (ratings.overall < 1 || ratings.overall > 5)) {
      set({ error: 'Overall rating must be between 1 and 5', isLoading: false });
      return { success: false, error: 'Overall rating must be between 1 and 5' };
    }

    const result = await apiRequest(`/feedback/${reviewId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ratings,
        reviews,
        recommendation,
        photos: photos || [],
        isPublic,
        demographics,
      }),
    });

    if (result.success) {
      // Update the review in the current list
      const currentReviews = get().reviews;
      const updatedReviews = currentReviews.map(review => 
        review._id === reviewId ? { ...review, ...result.data.data, isEdited: true } : review
      );
      set({ 
        reviews: updatedReviews,
        isLoading: false, 
        error: null 
      });
      toast.success('Review updated successfully!');
      return { success: true, data: result.data };
    } else {
      set({ error: result.error, isLoading: false });
      toast.error(result.error);
      return { success: false, error: result.error };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    
    const result = await apiRequest(`/feedback/${reviewId}`, {
      method: 'DELETE',
    });

    if (result.success) {
      // Remove the review from the current list
      const currentReviews = get().reviews;
      const filteredReviews = currentReviews.filter(review => review._id !== reviewId);
      set({ 
        reviews: filteredReviews,
        isLoading: false, 
        error: null 
      });
      toast.success('Review deleted successfully!');
      return { success: true, data: result.data };
    } else {
      set({ error: result.error, isLoading: false });
      toast.error(result.error);
      return { success: false, error: result.error };
    }
  },

  // Reply to a review (for organizers)
  replyToReview: async (reviewId, replyText) => {
    set({ isLoading: true, error: null });
    
    if (!replyText || replyText.trim().length === 0) {
      set({ error: 'Reply text is required', isLoading: false });
      return { success: false, error: 'Reply text is required' };
    }

    const result = await apiRequest(`/feedback/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text: replyText }),
    });

    if (result.success) {
      // Update the review with the response
      const currentReviews = get().reviews;
      const updatedReviews = currentReviews.map(review => 
        review._id === reviewId ? { ...review, response: result.data.data.response } : review
      );
      set({ 
        reviews: updatedReviews,
        isLoading: false, 
        error: null 
      });
      toast.success('Reply added successfully!');
      return { success: true, data: result.data };
    } else {
      set({ error: result.error, isLoading: false });
      toast.error(result.error);
      return { success: false, error: result.error };
    }
  },

  // Clear reviews (useful when switching events)
  clearReviews: () => set({ reviews: [], pagination: null, error: null }),
}));

export default useFeedbackStore;
