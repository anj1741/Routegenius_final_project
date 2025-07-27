// src/components/Navbar.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get auth state

/**
 * Navbar component provides navigation links.
 * It dynamically adjusts links based on authentication status and user role.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function Navbar({ navigateTo }) {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and logout function

  return (
    <nav className="bg-dark-blue-bg p-4 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name - Always navigates to home */}
        <button
          onClick={() => navigateTo('home')}
          className="text-primary-green text-2xl font-bold hover:text-primary-green-darker transition-colors duration-300"
        >
          RouteMax
        </button>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {/* Links for Authenticated Users */}
              <button
                onClick={() => navigateTo('home')}
                className="text-light-gray hover:text-primary-green transition-colors duration-300"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('track')}
                className="text-light-gray hover:text-primary-green transition-colors duration-300"
              >
                Track Parcel
              </button>
              <button
                onClick={() => navigateTo('notifications')}
                className="text-light-gray hover:text-primary-green transition-colors duration-300"
              >
                Notifications
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => navigateTo('adminDashboard')}
                  className="text-light-gray hover:text-primary-green transition-colors duration-300"
                >
                  Admin Dashboard
                </button>
              )}
              {user?.role === 'USER' && (
                <button
                  onClick={() => navigateTo('userDashboard')}
                  className="text-light-gray hover:text-primary-green transition-colors duration-300"
                >
                  User Dashboard
                </button>
              )}
              <span className="text-primary-green font-semibold">Hello, {user?.firstName || 'User'}</span>
              <button
                onClick={logout} // Call logout function from AuthContext
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Links for Unauthenticated Users */}
              <button
                onClick={() => navigateTo('home')}
                className="text-light-gray hover:text-primary-green transition-colors duration-300"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('track')}
                className="text-light-gray hover:text-primary-green transition-colors duration-300"
              >
                Track Parcel
              </button>
              <button
                onClick={() => navigateTo('login')}
                className="bg-primary-green text-dark-blue-text px-4 py-2 rounded-md hover:bg-primary-green-darker transition-colors duration-300 font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="text-light-gray border border-light-gray px-4 py-2 rounded-md hover:bg-light-gray hover:text-dark-blue-text transition-colors duration-300 font-semibold"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
