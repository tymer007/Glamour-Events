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
    ratings: {
      overall: 0,
      venue: 0,
      sound: 0,
      staff: 0,
      organization: 0,
    },
    reviews: {
      enjoyedMost: '',
      improvements: '',
      additional: '',
    },
    recommendation: false,
    photos: [],
    isAnonymous: false,
    anonymousName: '',
    demographics: {
      ageGroup: 'Prefer not to say',
      firstTimeVisitor: null,
    },
    isPublic: true,
  });
  const [hoveredRating, setHoveredRating] = useState({});
  const [photoFiles, setPhotoFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
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
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    }
    if (error) clearError();
  };

  const handleRatingClick = (rating, category = 'overall') => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));
  };

  const handleRatingHover = (rating, category = 'overall') => {
    setHoveredRating(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleRatingLeave = (category = 'overall') => {
    setHoveredRating(prev => ({
      ...prev,
      [category]: 0
    }));
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.ratings.overall === 0) {
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

  const renderStars = (category = 'overall', size = 'text-3xl') => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleRatingClick(star, category)}
        onMouseEnter={() => handleRatingHover(star, category)}
        onMouseLeave={() => handleRatingLeave(category)}
        className={`${size} transition-colors ${
          star <= (hoveredRating[category] || formData.ratings[category])
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
        {formData.ratings.overall === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            Please select an overall rating
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-cormorant text-glamDarkBrown font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="font-cormorant text-glamDarkBrown/60 text-sm">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-glamGold h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Overall Rating and Recommendation */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-cormorant text-glamDarkBrown font-semibold text-xl mb-6">
                  How would you rate this event?
                </h3>
                <div className="flex justify-center space-x-2 mb-4">
                  {renderStars('overall')}
                </div>
                <p className="font-cormorant text-glamDarkBrown/60 text-sm">
                  {formData.ratings.overall === 0 
                    ? 'Click a star to rate' 
                    : `${formData.ratings.overall} star${formData.ratings.overall > 1 ? 's' : ''}`
                  }
                </p>
              </div>

              <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-6">
                <h4 className="font-cormorant text-glamDarkBrown font-semibold mb-4 text-center">
                  Would you recommend this event?
                </h4>
                <div className="flex justify-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recommendation"
                      value="true"
                      checked={formData.recommendation === true}
                      onChange={() => setFormData(prev => ({ ...prev, recommendation: true }))}
                      className="text-glamGold focus:ring-glamGold/20"
                    />
                    <span className="ml-2 font-cormorant text-glamDarkBrown">Yes, I would recommend</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recommendation"
                      value="false"
                      checked={formData.recommendation === false}
                      onChange={() => setFormData(prev => ({ ...prev, recommendation: false }))}
                      className="text-glamGold focus:ring-glamGold/20"
                    />
                    <span className="ml-2 font-cormorant text-glamDarkBrown">No, I would not recommend</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={formData.ratings.overall === 0 || formData.recommendation === undefined}
                  className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Ratings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-cormorant text-glamDarkBrown font-semibold text-xl mb-6">
                  Rate specific aspects (Optional)
                </h3>
                <p className="font-cormorant text-glamDarkBrown/60 mb-8">
                  Help others understand what made this event special
                </p>
              </div>

              <div className="space-y-6">
                {/* Venue Rating */}
                <div className="flex items-center justify-between p-4 bg-glamCream/20 rounded-lg">
                  <label className="font-cormorant text-glamDarkBrown font-medium text-lg">Venue</label>
                  <div className="flex space-x-1">
                    {renderStars('venue', 'text-2xl')}
                  </div>
                </div>

                {/* Sound Rating */}
                <div className="flex items-center justify-between p-4 bg-glamCream/20 rounded-lg">
                  <label className="font-cormorant text-glamDarkBrown font-medium text-lg">Sound Quality</label>
                  <div className="flex space-x-1">
                    {renderStars('sound', 'text-2xl')}
                  </div>
                </div>

                {/* Staff Rating */}
                <div className="flex items-center justify-between p-4 bg-glamCream/20 rounded-lg">
                  <label className="font-cormorant text-glamDarkBrown font-medium text-lg">Staff Service</label>
                  <div className="flex space-x-1">
                    {renderStars('staff', 'text-2xl')}
                  </div>
                </div>

                {/* Organization Rating */}
                <div className="flex items-center justify-between p-4 bg-glamCream/20 rounded-lg">
                  <label className="font-cormorant text-glamDarkBrown font-medium text-lg">Organization</label>
                  <div className="flex space-x-1">
                    {renderStars('organization', 'text-2xl')}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Previous
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="bg-gray-300 hover:bg-gray-400 text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Comments */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-cormorant text-glamDarkBrown font-semibold text-xl mb-6">
                  Share your experience
                </h3>
                <p className="font-cormorant text-glamDarkBrown/60 mb-8">
                  Tell others what you thought about this event
                </p>
              </div>

              <div className="space-y-6">
                {/* What you enjoyed most */}
                <div>
                  <label className="block font-cormorant text-glamDarkBrown font-medium mb-3 text-lg">
                    What did you enjoy most?
                  </label>
                  <textarea
                    name="reviews.enjoyedMost"
                    value={formData.reviews.enjoyedMost}
                    onChange={handleChange}
                    className="w-full p-4 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all resize-none"
                    placeholder="What made this event special for you?"
                    rows="4"
                    maxLength="1000"
                  />
                  <p className="text-right font-cormorant text-glamDarkBrown/60 text-sm mt-2">
                    {formData.reviews.enjoyedMost.length}/1000 characters
                  </p>
                </div>

                {/* Areas for improvement */}
                <div>
                  <label className="block font-cormorant text-glamDarkBrown font-medium mb-3 text-lg">
                    Areas for improvement
                  </label>
                  <textarea
                    name="reviews.improvements"
                    value={formData.reviews.improvements}
                    onChange={handleChange}
                    className="w-full p-4 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all resize-none"
                    placeholder="What could have been better?"
                    rows="4"
                    maxLength="1000"
                  />
                  <p className="text-right font-cormorant text-glamDarkBrown/60 text-sm mt-2">
                    {formData.reviews.improvements.length}/1000 characters
                  </p>
                </div>

                {/* Additional comments */}
                <div>
                  <label className="block font-cormorant text-glamDarkBrown font-medium mb-3 text-lg">
                    Additional comments
                  </label>
                  <textarea
                    name="reviews.additional"
                    value={formData.reviews.additional}
                    onChange={handleChange}
                    className="w-full p-4 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all resize-none"
                    placeholder="Any other thoughts about the event?"
                    rows="4"
                    maxLength="1000"
                  />
                  <p className="text-right font-cormorant text-glamDarkBrown/60 text-sm mt-2">
                    {formData.reviews.additional.length}/1000 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Previous
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="bg-gray-300 hover:bg-gray-400 text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos, Demographics, and Anonymous */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-cormorant text-glamDarkBrown font-semibold text-xl mb-6">
                  Additional information
                </h3>
                <p className="font-cormorant text-glamDarkBrown/60 mb-8">
                  Add photos and optional details
                </p>
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block font-cormorant text-glamDarkBrown font-semibold mb-4 text-lg">
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
                    className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      photoFiles.length >= 5
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'border-glamGold/30 text-glamDarkBrown hover:border-glamGold hover:bg-glamGold/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCamera} className="mr-3 text-xl" />
                    <span className="font-cormorant text-lg">
                      {photoFiles.length >= 5 
                        ? 'Maximum 5 photos allowed' 
                        : 'Click to add photos (max 5)'
                      }
                    </span>
                  </label>
                  
                  {/* Photo Preview */}
                  {photoFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photoFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Demographics Section */}
              <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-6">
                <h4 className="font-cormorant text-glamDarkBrown font-semibold mb-4 text-lg">Demographics (Optional)</h4>
                
                {/* Age Group */}
                <div className="mb-4">
                  <label className="block font-cormorant text-glamDarkBrown font-medium mb-2">
                    Age Group
                  </label>
                  <select
                    name="demographics.ageGroup"
                    value={formData.demographics.ageGroup}
                    onChange={handleChange}
                    className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold transition-colors"
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                  </select>
                </div>

                {/* First Time Visitor */}
                <div>
                  <label className="block font-cormorant text-glamDarkBrown font-medium mb-3">
                    Is this your first time attending this type of event?
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="demographics.firstTimeVisitor"
                        value="true"
                        checked={formData.demographics.firstTimeVisitor === true}
                        onChange={() => setFormData(prev => ({ 
                          ...prev, 
                          demographics: { ...prev.demographics, firstTimeVisitor: true }
                        }))}
                        className="text-glamGold focus:ring-glamGold/20"
                      />
                      <span className="ml-2 font-cormorant text-glamDarkBrown">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="demographics.firstTimeVisitor"
                        value="false"
                        checked={formData.demographics.firstTimeVisitor === false}
                        onChange={() => setFormData(prev => ({ 
                          ...prev, 
                          demographics: { ...prev.demographics, firstTimeVisitor: false }
                        }))}
                        className="text-glamGold focus:ring-glamGold/20"
                      />
                      <span className="ml-2 font-cormorant text-glamDarkBrown">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="demographics.firstTimeVisitor"
                        value="null"
                        checked={formData.demographics.firstTimeVisitor === null}
                        onChange={() => setFormData(prev => ({ 
                          ...prev, 
                          demographics: { ...prev.demographics, firstTimeVisitor: null }
                        }))}
                        className="text-glamGold focus:ring-glamGold/20"
                      />
                      <span className="ml-2 font-cormorant text-glamDarkBrown">Prefer not to say</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-6">
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
                    <label htmlFor="isAnonymous" className="font-cormorant text-glamDarkBrown font-semibold cursor-pointer text-lg">
                      Submit anonymously
                    </label>
                    <p className="font-cormorant text-glamDarkBrown/60 text-sm mt-1">
                      Your name won't be shown with this review
                    </p>
                    
                    {formData.isAnonymous && (
                      <div className="mt-4">
                        <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
                          Display name (optional)
                        </label>
                        <input
                          type="text"
                          name="anonymousName"
                          value={formData.anonymousName}
                          onChange={handleChange}
                          className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold transition-colors"
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

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Submitting Review...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </div>
          )}
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
