import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-glamCream to-glamWhite flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img 
              src="/glmr_evnt_logo.png" 
              alt="Glamour Events" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          {title && (
            <h1 className="font-satisfy font-satisfy-bold text-4xl text-glamDarkBrown mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-cormorant text-glamDarkBrown/80 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Auth Form Container */}
        <div className="bg-glamWhite/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-glamGold/20 p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="font-cormorant text-glamDarkBrown/60 text-sm">
            © 2024 Glamour Events. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
