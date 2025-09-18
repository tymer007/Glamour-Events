import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faSpinner, 
  faArrowLeft, 
  faCamera, 
  faTimes,
  faUser,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import useFeedbackStore from '../../store/feedbackStore';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';

const EventReview = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    photos: [],
    isAnonymous: false,
    anonymousName: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    createReview, 
    isLoading, 
    error, 
    clearError,
    user,
    isAuthenticated 
  } = useFeedbackStore();
  const { user: authUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) clearError();
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photoFiles.length > 5) {
      clearError();
      return;
    }
    setPhotoFiles(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      clearError();
      return;
    }

    if (formData.isAnonymous && !formData.anonymousName.trim()) {
      setFormData(prev => ({ ...prev, anonymousName: 'Anonymous' }));
    }

    // Convert files to base64 for upload (in a real app, you'd upload to cloudinary)
    const photoUrls = photoFiles.map(file => URL.createObjectURL(file));

    const result = await createReview(eventId, {
      ...formData,
      photos: photoUrls,
    });

    if (result.success) {
      navigate(`/events/${eventId}`, { 
        state: { message: 'Review submitted successfully!' } 
      });
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleRatingClick(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className={`text-3xl transition-colors ${
          star <= (hoveredRating || formData.rating)
            ? 'text-glamGold'
            : 'text-gray-300 hover:text-glamGold/50'
        }`}
      >
        <FontAwesomeIcon icon={faStar} />
      </button>
    ));
  };

  return (
    <AuthLayout 
      title="Review Event"
      subtitle="Share your experience and help others"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to={`/events/${eventId}`}
            className="flex items-center text-glamDarkBrown/60 hover:text-glamGold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-cormorant">Back to Event</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Rating Validation Warning */}
        {formData.rating === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            Please select a rating
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="text-center">
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-4">
              How would you rate this event? *
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {renderStars()}
            </div>
            <p className="font-cormorant text-glamDarkBrown/60 text-sm">
              {formData.rating === 0 
                ? 'Click a star to rate' 
                : `${formData.rating} star${formData.rating > 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Comment Section */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Share your experience
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all resize-none"
              placeholder="Tell others about your experience at this event..."
              rows="4"
              maxLength="2000"
            />
            <p className="text-right font-cormorant text-glamDarkBrown/60 text-xs mt-1">
              {formData.comment.length}/2000 characters
            </p>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Add Photos (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                disabled={photoFiles.length >= 5}
              />
              <label
                htmlFor="photo-upload"
                className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  photoFiles.length >= 5
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-glamGold/30 text-glamDarkBrown hover:border-glamGold hover:bg-glamGold/5'
                }`}
              >
                <FontAwesomeIcon icon={faCamera} className="mr-2" />
                <span className="font-cormorant">
                  {photoFiles.length >= 5 
                    ? 'Maximum 5 photos allowed' 
                    : 'Click to add photos (max 5)'
                  }
                </span>
              </label>
              
              {/* Photo Preview */}
              {photoFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photoFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="mt-1 text-glamGold focus:ring-glamGold/20 rounded"
              />
              <div className="flex-1">
                <label htmlFor="isAnonymous" className="font-cormorant text-glamDarkBrown font-semibold cursor-pointer">
                  Submit anonymously
                </label>
                <p className="font-cormorant text-glamDarkBrown/60 text-sm mt-1">
                  Your name won't be shown with this review
                </p>
                
                {formData.isAnonymous && (
                  <div className="mt-3">
                    <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
                      Display name (optional)
                    </label>
                    <input
                      type="text"
                      name="anonymousName"
                      value={formData.anonymousName}
                      onChange={handleChange}
                      className="w-full p-2 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
                      placeholder="Anonymous"
                      maxLength="100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info Display */}
          {isAuthenticated && authUser && !formData.isAnonymous && (
            <div className="bg-glamGold/10 border border-glamGold/30 rounded-lg p-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="text-glamGold mr-2" />
                <span className="font-cormorant text-glamDarkBrown">
                  Reviewing as: <strong>{authUser.name}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || formData.rating === 0}
            className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </form>

        {/* Help Text */}
        <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-4">
          <h3 className="font-cormorant font-semibold text-glamDarkBrown mb-2">
            Review Guidelines
          </h3>
          <ul className="font-cormorant text-glamDarkBrown/80 text-sm space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on your experience at the event</li>
            <li>• Avoid personal attacks or inappropriate content</li>
            <li>• Photos should be relevant to the event</li>
            <li>• You can edit or delete your review later</li>
          </ul>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EventReview;
