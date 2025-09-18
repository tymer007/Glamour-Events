import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    age: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== confirmPassword) {
      clearError();
      return;
    }

    // Validate age is a number
    if (isNaN(formData.age) || formData.age < 13 || formData.age > 120) {
      clearError();
      return;
    }

    const result = await signUp(formData);
    if (result.success) {
      // Navigate to verification page with email
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          message: 'Please check your email for the verification code.'
        } 
      });
    }
  };

  const passwordsMatch = formData.password === confirmPassword && confirmPassword.length > 0;

  return (
    <AuthLayout 
      title="Join Glamour Events"
      subtitle="Create your account to start planning amazing events"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-glamDarkBrown/60 hover:text-glamGold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-cormorant">Back to Home</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Password Mismatch Warning */}
        {confirmPassword.length > 0 && !passwordsMatch && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            Passwords do not match
          </div>
        )}

        {/* Age Validation Warning */}
        {formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 120) && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            Please enter a valid age between 13 and 120
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
              placeholder="Enter your age"
              min="13"
              max="120"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Gender *
            </label>
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
          </div>

          {/* Password */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pr-10 border border-glamGold/30 rounded-lg font-cormorant focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all"
                placeholder="Create a password"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glamDarkBrown/60 hover:text-glamGold transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 pr-10 border rounded-lg font-cormorant focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword.length > 0 
                    ? passwordsMatch 
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' 
                      : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-glamGold/30 focus:border-glamGold focus:ring-glamGold/20'
                }`}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glamDarkBrown/60 hover:text-glamGold transition-colors"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="font-cormorant text-glamDarkBrown/80">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
