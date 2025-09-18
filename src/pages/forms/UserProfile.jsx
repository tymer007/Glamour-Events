import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEdit, 
  faSave, 
  faTimes, 
  faSpinner, 
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    clearError, 
    updateProfile, 
    signOut 
  } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        age: user.age || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
    clearError();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        age: user.age || '',
        gender: user.gender || '',
      });
    }
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthLayout 
      title="My Profile"
      subtitle="Manage your account information"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center text-glamDarkBrown/60 hover:text-glamGold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-cormorant">Back to Home</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-cormorant font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-glamGold/10 border border-glamGold/30 rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-glamGold rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUser} className="text-glamDarkBrown text-2xl" />
          </div>
          <h2 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown mb-2">
            {user.name}
          </h2>
          <p className="font-cormorant text-glamDarkBrown/80">
            {user.email}
          </p>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-cormorant font-semibold ${
              user.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                required
              />
            ) : (
              <div className="w-full p-3 bg-glamCream/30 border border-glamGold/20 rounded-lg font-cormorant text-glamDarkBrown">
                {user.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Email Address
            </label>
            <div className="w-full p-3 bg-glamCream/30 border border-glamGold/20 rounded-lg font-cormorant text-glamDarkBrown/80">
              {user.email}
            </div>
            <p className="text-xs font-cormorant text-glamDarkBrown/60 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                required
              />
            ) : (
              <div className="w-full p-3 bg-glamCream/30 border border-glamGold/20 rounded-lg font-cormorant text-glamDarkBrown">
                {user.phoneNumber}
              </div>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Age
            </label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                min="13"
                max="120"
                required
              />
            ) : (
              <div className="w-full p-3 bg-glamCream/30 border border-glamGold/20 rounded-lg font-cormorant text-glamDarkBrown">
                {user.age}
              </div>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Gender
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            ) : (
              <div className="w-full p-3 bg-glamCream/30 border border-glamGold/20 rounded-lg font-cormorant text-glamDarkBrown capitalize">
                {user.gender}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-cormorant font-semibold py-3 rounded-full transition-all flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </form>

        {/* Account Info */}
        <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-4">
          <h3 className="font-cormorant font-semibold text-glamDarkBrown mb-2">
            Account Information
          </h3>
          <div className="space-y-2 text-sm font-cormorant text-glamDarkBrown/80">
            <div className="flex justify-between">
              <span>Member since:</span>
              <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={user.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                {user.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserProfile;
