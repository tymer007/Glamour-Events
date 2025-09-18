import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  
  const { verifyEmail, resendVerificationCode, isLoading, error, clearError } = useAuthStore();

  // Get email from location state
  const email = location.state?.email;
  const message = location.state?.message || 'Please check your email for the verification code.';

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/signup');
      // console.log("first")
    }
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setCode(value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    const result = await verifyEmail({ email, code });
    if (result.success) {
      // Navigate to home or intended page
      navigate('/', { replace: true });
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    const result = await resendVerificationCode(email);
    if (result.success) {
      setResendMessage('New verification code sent! Please check your email.');
      setResendCooldown(60); // 60 second cooldown
      setTimeout(() => setResendMessage(''), 5000);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [code]);

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthLayout 
      title="Verify Your Email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/signin" 
            className="flex items-center text-glamDarkBrown/60 hover:text-glamGold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-cormorant">Back to Sign In</span>
          </Link>
        </div>

        {/* Email Info */}
        <div className="bg-glamGold/10 border border-glamGold/30 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-glamGold mr-2" />
            <span className="font-cormorant font-semibold text-glamDarkBrown">
              {email}
            </span>
          </div>
          <p className="font-cormorant text-glamDarkBrown/80 text-sm text-center">
            {message}
          </p>
        </div>

        {/* Success Message */}
        {resendMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            {resendMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Code Input */}
          <div>
            <label className="block font-cormorant text-glamDarkBrown font-semibold mb-2 text-center">
              Verification Code
            </label>
            <div className="flex justify-center">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="w-48 p-4 border border-glamGold/30 rounded-lg focus:outline-none focus:border-glamGold focus:ring-2 focus:ring-glamGold/20 transition-all text-center text-3xl tracking-widest font-mono"
                placeholder="000000"
                maxLength="6"
                required
                autoComplete="one-time-code"
              />
            </div>
            <p className="text-center font-cormorant text-glamDarkBrown/60 text-sm mt-2">
              Enter the 6-digit code from your email
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend Code Section */}
        <div className="text-center space-y-2">
          <p className="font-cormorant text-glamDarkBrown/80">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isLoading || resendCooldown > 0}
            className="text-glamGold hover:text-glamCreamDark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : 'Resend Code'
            }
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-glamCream/30 border border-glamGold/20 rounded-lg p-4">
          <h3 className="font-cormorant font-semibold text-glamDarkBrown mb-2">
            Need Help?
          </h3>
          <ul className="font-cormorant text-glamDarkBrown/80 text-sm space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• The code expires in 15 minutes</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
