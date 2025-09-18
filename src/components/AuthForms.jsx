import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../store/authStore';

// Sign Up Form Component
export const SignUpForm = ({ onSuccess, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp(formData);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <div className="bg-glamWhite p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="font-satisfy font-satisfy-bold text-3xl text-glamDarkBrown text-center mb-6">
        Create Account
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glamDarkBrown/60 hover:text-glamGold"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-colors shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          ) : null}
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center font-cormorant text-glamDarkBrown/80 mt-4">
        Already have an account?{' '}
        <button
          onClick={onSwitchToSignIn}
          className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

// Sign In Form Component
export const SignInForm = ({ onSuccess, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(formData);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <div className="bg-glamWhite p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="font-satisfy font-satisfy-bold text-3xl text-glamDarkBrown text-center mb-6">
        Welcome Back
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glamDarkBrown/60 hover:text-glamGold"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-colors shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          ) : null}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center font-cormorant text-glamDarkBrown/80 mt-4">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignUp}
          className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors"
        >
          Create Account
        </button>
      </p>
    </div>
  );
};

// Email Verification Form Component
export const EmailVerificationForm = ({ email, onSuccess, onResendCode }) => {
  const [code, setCode] = useState('');
  
  const { verifyEmail, resendVerificationCode, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    setCode(e.target.value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyEmail({ email, code });
    if (result.success) {
      onSuccess?.();
    }
  };

  const handleResendCode = async () => {
    const result = await resendVerificationCode(email);
    if (result.success) {
      onResendCode?.();
    }
  };

  return (
    <div className="bg-glamWhite p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="font-satisfy font-satisfy-bold text-3xl text-glamDarkBrown text-center mb-6">
        Verify Your Email
      </h2>
      
      <p className="font-cormorant text-glamDarkBrown/80 text-center mb-6">
        We've sent a verification code to <strong>{email}</strong>
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={handleChange}
            className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors text-center text-2xl tracking-widest"
            placeholder="Enter 6-digit code"
            maxLength="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-colors shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          ) : null}
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="font-cormorant text-glamDarkBrown/80 mb-2">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendCode}
          disabled={isLoading}
          className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors disabled:opacity-50"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
};

// Main Auth Modal Component
export const AuthModal = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'verify'
  const [userEmail, setUserEmail] = useState('');
  const { user, needsVerification, signOut } = useAuthStore();

  const handleSignUpSuccess = (userData) => {
    setUserEmail(userData.email);
    setAuthMode('verify');
  };

  const handleVerificationSuccess = () => {
    onClose();
    setAuthMode('signin');
  };

  const handleSignInSuccess = () => {
    onClose();
  };

  const handleResendSuccess = () => {
    // You could show a toast notification here
    console.log('Verification code resent successfully');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-glamGold text-glamDarkBrown rounded-full w-8 h-8 flex items-center justify-center hover:bg-glamCreamDark transition-colors z-10"
        >
          ×
        </button>
        
        {authMode === 'signin' && (
          <SignInForm
            onSuccess={handleSignInSuccess}
            onSwitchToSignUp={() => setAuthMode('signup')}
          />
        )}
        
        {authMode === 'signup' && (
          <SignUpForm
            onSuccess={handleSignUpSuccess}
            onSwitchToSignIn={() => setAuthMode('signin')}
          />
        )}
        
        {authMode === 'verify' && (
          <EmailVerificationForm
            email={userEmail}
            onSuccess={handleVerificationSuccess}
            onResendCode={handleResendSuccess}
          />
        )}
      </div>
    </div>
  );
};
