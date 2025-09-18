import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../store/authStore';
import { AuthModal } from './AuthForms';

const AuthButton = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faUser} className="text-glamGold" />
          <span className="font-cormorant text-glamDarkBrown">
            Welcome, {user.name}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-full transition-colors"
      >
        Sign In
      </button>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default AuthButton;
