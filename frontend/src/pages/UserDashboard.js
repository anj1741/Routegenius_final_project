// src/pages/UserDashboard.js
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar for consistent navigation
import Footer from '../components/Footer'; // Import Footer for consistent footer
import ParcelTrackingDisplay from '../components/user/ParcelTrackingDisplay'; // Component for quick tracking
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook to get authentication state
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner for loading state
import UserParcelsPage from './UserParcelsPage'; // Page to list user's own parcels

/**
 * UserDashboard component displays the main dashboard for authenticated users.
 * It provides quick parcel tracking and a list of the user's own parcels.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function UserDashboard({ navigateTo }) {
  // Get authentication state and user information from the AuthContext
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Show a loading spinner while authentication state is being determined
  if (authLoading) {
    console.log('UserDashboard: Auth still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }


  if (!isAuthenticated || user?.role !== 'USER') { // Note: Changed 'ROLE_USER' to 'USER' assuming your backend returns "USER"
    console.warn('UserDashboard: Attempted to render without proper USER authentication. Displaying fallback.');
    // Fallback if somehow reached here incorrectly (App.js should prevent this)
    return (
      <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray items-center justify-center">
        <p className="text-red-500 text-xl">Access Denied. Please log in as a User.</p>
        <button onClick={() => navigateTo('login')} className="mt-4 text-primary-green hover:underline">Go to Login</button>
      </div>
    );
  }

  console.log('UserDashboard: Rendering for user:', user.email);

  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      {/* Navbar for consistent navigation */}
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="bg-card-dark rounded-xl shadow-lg p-6 md:p-8">
          {/* Dashboard heading showing the logged-in user's first name */}
          <h2 className="text-3xl font-bold text-primary-green mb-6 border-b border-gray-700 pb-4">
            Welcome, {user ? user.firstName : 'User'}!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Parcel Tracking Section */}
            <div>
              <h3 className="text-2xl font-bold text-light-gray mb-4">Quick Track Any Parcel</h3>
              {/* ParcelTrackingDisplay allows users to track any parcel by ID */}
              <ParcelTrackingDisplay />
            </div>

            {/* User's Own Parcels Section */}
            <div>
              <h3 className="text-2xl font-bold text-light-gray mb-4">My Parcels</h3>
              {/* UserParcelsPage component fetches and displays parcels belonging to the logged-in user */}
              <UserParcelsPage />
            </div>
          </div>
        </div>
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default UserDashboard;
