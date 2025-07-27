// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminParcelManagement from '../components/admin/AdminParcelManagement';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * AdminDashboard component displays the main dashboard for authenticated administrators.
 * It provides navigation to user management and parcel management sections.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function AdminDashboard({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('userManagement'); // State to manage active tab

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Show a loading spinner while authentication state is being determined
  if (authLoading) {
    console.log('AdminDashboard: Auth still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // IMPORTANT: The redirection logic based on isAuthenticated and user?.role
  // has been moved to App.js's useEffect. This component should only render
  // if App.js has already determined it's the correct dashboard to show.
  // If for some reason user is null or not authenticated here, it implies
  // a deeper issue with AuthContext or App.js's initial routing, but
  // this component itself should not trigger a navigateTo during render.
  // We can add a fallback message, but not a direct navigation.
  if (!isAuthenticated || user?.role !== 'ADMIN') { // Note: Changed 'ROLE_ADMIN' to 'ADMIN' assuming your backend returns "ADMIN"
    console.warn('AdminDashboard: Attempted to render without proper ADMIN authentication. Displaying fallback.');
    // Fallback if somehow reached here incorrectly (App.js should prevent this)
    return (
      <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray items-center justify-center">
        <p className="text-red-500 text-xl">Access Denied. Please log in as an Admin.</p>
        <button onClick={() => navigateTo('login')} className="mt-4 text-primary-green hover:underline">Go to Login</button>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering for admin:', user.email);


  const renderActiveTab = () => {
    switch (activeTab) {
      case 'userManagement':
        return <AdminUserManagement />;
      case 'parcelManagement':
        return <AdminParcelManagement />;
      default:
        return <AdminUserManagement />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="bg-card-dark rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-primary-green mb-6 border-b border-gray-700 pb-4">
            Admin Dashboard
          </h2>

          {/* Tab Navigation */}
          <div className="mb-6 flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('userManagement')}
              className={`py-2 px-4 text-lg font-semibold rounded-t-lg transition-colors duration-300 ${
                activeTab === 'userManagement'
                  ? 'bg-primary-green text-dark-blue-text'
                  : 'text-light-gray hover:bg-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('parcelManagement')}
              className={`py-2 px-4 text-lg font-semibold rounded-t-lg transition-colors duration-300 ${
                activeTab === 'parcelManagement'
                  ? 'bg-primary-green text-dark-blue-text'
                  : 'text-light-gray hover:bg-gray-700'
              }`}
            >
              Parcel Management
            </button>
          </div>

          {/* Render Active Tab Content */}
          {renderActiveTab()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
