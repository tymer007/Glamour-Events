import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faArrowLeft, 
  faCamera, 
  faTimes,
  faCalendarAlt,
  faMapMarkerAlt,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import AuthLayout from './AuthLayout';

const EventCreation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Other',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const { user, isAuthenticated } = useAuthStore();
  const { createEvent, isLoading, error, clearError } = useEventStore();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        clearError();
        return;
      }
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.location) {
      clearError();
      return;
    }

    const eventData = {
      ...formData,
      banner: bannerFile
    };

    const result = await createEvent(eventData, user.accessToken);
    
    if (result.success) {
      navigate('/events', { 
        state: { message: 'Event created successfully!' } 
      });
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthLayout 
      title="Create Event"
      subtitle="Share your event with the Glamour Events community"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/events"
            className="flex items-center text-glamDarkBrown/60 hover:text-glamGold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-cormorant">Back to Events</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
              placeholder="Enter event title"
              required
              maxLength="100"
            />
            <p className="text-right font-cormorant text-glamDarkBrown/60 text-xs mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Event Description */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all resize-none"
              placeholder="Describe your event..."
              rows="4"
              maxLength="1000"
            />
            <p className="text-right font-cormorant text-glamDarkBrown/60 text-xs mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Date and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Date */}
            <div>
              <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Event Date *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                required
              />
            </div>

            {/* Event Location */}
            <div>
              <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                placeholder="Enter event location"
                required
                maxLength="200"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              <FontAwesomeIcon icon={faTag} className="mr-2" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
            >
              <option value="Concert">Concert</option>
              <option value="Seminar">Seminar</option>
              <option value="Wedding">Wedding</option>
              <option value="Conference">Conference</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              <FontAwesomeIcon icon={faCamera} className="mr-2" />
              Event Banner (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-glamGold/30 text-glamDarkBrown hover:border-glamGold hover:bg-glamGold/5"
              >
                <FontAwesomeIcon icon={faCamera} className="mr-2" />
                <span className="font-cormorant">
                  {bannerFile ? 'Change Banner' : 'Click to upload banner image'}
                </span>
              </label>
              
              {/* Banner Preview */}
              {bannerPreview && (
                <div className="relative group">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-sm" />
                  </button>
                </div>
              )}
            </div>
            <p className="font-cormorant text-glamDarkBrown/60 text-xs mt-1">
              Recommended size: 1200x600px, Max size: 5MB
            </p>
          </div>

          {/* Creator Info */}
          <div className="bg-glamGold/10 border border-glamGold/30 rounded-lg p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="text-glamGold mr-2" />
              <span className="font-cormorant text-glamDarkBrown">
                Creating event as: <strong>{user.name}</strong>
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>

        {/* Help Text */}
        <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-4">
          <h3 className="font-cormorant font-semibold text-glamDarkBrown mb-2">
            Event Creation Guidelines
          </h3>
          <ul className="font-cormorant text-glamDarkBrown/80 text-sm space-y-1">
            <li>• Provide a clear and descriptive title</li>
            <li>• Include all relevant details in the description</li>
            <li>• Choose the most appropriate category</li>
            <li>• Upload a high-quality banner image if possible</li>
            <li>• Ensure the date and time are accurate</li>
            <li>• You can edit your event after creation</li>
          </ul>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EventCreation;
