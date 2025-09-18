import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading, error, clearError, needsVerification } = useAuthStore();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(formData);
    if (result.success) {
      // Navigate to the intended page or home
      navigate(from, { replace: true });
    } else if (needsVerification) {
      // If user needs verification, redirect to verification page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          message: 'Please verify your email to continue.'
        } 
      });
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to your Glamour Events account"
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

        {/* Verification Required Message */}
        {needsVerification && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
            Please verify your email address to continue. Check your email for the verification code.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                required
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

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-glamGold hover:text-glamCreamDark font-cormorant text-sm transition-colors"
              onClick={() => {
                // TODO: Implement forgot password functionality
                console.log('Forgot password clicked');
              }}
            >
              Forgot Password?
            </button>
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="font-cormorant text-glamDarkBrown/80">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Demo Account Info */}
        <div className="bg-glamGold/10 border border-glamGold/30 rounded-lg p-4 mt-6">
          <h3 className="font-cormorant font-semibold text-glamDarkBrown mb-2">
            Demo Account
          </h3>
          <p className="font-cormorant text-glamDarkBrown/80 text-sm">
            For testing purposes, you can use any email and password combination to sign up.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
