import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faCog, 
  faEdit, 
  faEnvelope,
  faSignInAlt,
  faChevronDown,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../store/authStore';

const UserMenu = () => {
    const { isAuthenticated, user, signOut } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const getAvatarImage = () => {
        if (!user?.gender || user.gender === 'prefer-not-to-say') {
            return '/user.png';
        }
        return user.gender === 'male' ? '/male.png' : '/female.png';
    };

    const getFirstName = (name) => {
        if (!name) return '';
        return name.split(' ')[0];
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        signOut();
        setIsOpen(false);
        navigate('/');
    };

    // Navigate admin users to dashboard on login
    React.useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, user?.role, navigate]);

    if (!isAuthenticated) {
        return (
            <Link
                to="/signin"
                className="flex items-center space-x-2 text-glamDarkBrown hover:text-glamGold transition-colors"
            >
                <FontAwesomeIcon icon={faSignInAlt} className="text-lg" />
                <span className="font-cormorant font-semibold">Sign In</span>
            </Link>
        );
    }

    return (
        <div className="relative">
            {/* Welcome Message and Avatar */}
            <div className="flex items-center space-x-3">
                <span className="font-cormorant text-glamDarkBrown">
                    Welcome, <span className="font-semibold">{getFirstName(user?.name)}</span>
                </span>
                
                <button
                    onClick={toggleMenu}
                    onMouseEnter={() => setIsOpen(true)}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-glamGold/30 hover:border-glamGold transition-all duration-200 hover:scale-105"
                >
                    <img
                        src={getAvatarImage()}
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/user.png';
                        }}
                    />
                    {!user?.isVerified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faEnvelope} className="text-white text-xs" />
                        </div>
                    )}
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-3 w-64 bg-glamWhite rounded-lg shadow-xl border border-glamGold/20 z-50"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-glamGold/20">
                        <div className="flex items-center space-x-3">
                            <img
                                src={getAvatarImage()}
                                alt={user?.name || 'User'}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/user.png';
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-cormorant font-semibold text-glamDarkBrown truncate">
                                    {user?.name}
                                </p>
                                <p className="font-cormorant text-sm text-glamDarkBrown/70 truncate">
                                    {user?.email}
                                </p>
                                {!user?.isVerified && (
                                    <p className="font-cormorant text-xs text-red-500">
                                        Email not verified
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <Link 
                            to="/profile" 
                            className="flex items-center space-x-3 px-3 py-2 text-glamDarkBrown hover:bg-glamGold/10 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-glamGold" />
                            <span className="font-cormorant">My Profile</span>
                        </Link>

                        {/* Create Event Link - Show only for admin users */}
                        {user?.role === 'admin' && (
                            <Link 
                                to="/create-event" 
                                className="flex items-center space-x-3 px-3 py-2 text-glamDarkBrown hover:bg-glamGold/10 rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faEdit} className="text-glamGold" />
                                <span className="font-cormorant">Create Event</span>
                            </Link>
                        )}

                        {/* Admin Dashboard Link - Show only for admin users */}
                        {user?.role === 'admin' && (
                            <Link 
                                to="/admin/dashboard" 
                                className="flex items-center space-x-3 px-3 py-2 text-glamDarkBrown hover:bg-glamGold/10 rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faChartLine} className="text-glamGold" />
                                <span className="font-cormorant">Admin Dashboard</span>
                            </Link>
                        )}

                        {!user?.isVerified && (
                            <Link 
                                to="/verify-email" 
                                className="flex items-center space-x-3 px-3 py-2 text-glamDarkBrown hover:bg-glamGold/10 rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faEnvelope} className="text-glamGold" />
                                <span className="font-cormorant">Verify Email</span>
                            </Link>
                        )}

                        <div className="border-t border-glamGold/20 my-2"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
                            <span className="font-cormorant">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;