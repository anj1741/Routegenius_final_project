// src/App.js
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';
import ParcelTrackingPage from './pages/ParcelTrackingPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';

// Main App component that handles routing
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [trackingIdFromHome, setTrackingIdFromHome] = useState('');

  const { isAuthenticated, user, loading: authLoading } = useAuth();

  // Effect to set initial page based on authentication status after loading
  useEffect(() => {
    console.log('App.js useEffect: authLoading:', authLoading, 'isAuthenticated:', isAuthenticated, 'user:', user, 'Current stored page:', currentPage);
    if (!authLoading) { // Only run once auth state is determined
      // If authenticated and current page is 'home', 'login', or 'register',
      // or if the current page is a dashboard but the role doesn't match,
      // then redirect to the correct dashboard.
      const isDashboardPage = currentPage === 'userDashboard' || currentPage === 'adminDashboard';
      const isAuthPage = currentPage === 'login' || currentPage === 'register';

      if (isAuthenticated) {
        if (user?.role === 'ADMIN') {
          if (isAuthPage || currentPage === 'home' || (isDashboardPage && user.role !== 'ADMIN')) {
            setCurrentPage('adminDashboard');
          }
        } else if (user?.role === 'USER') {
          if (isAuthPage || currentPage === 'home' || (isDashboardPage && user.role !== 'USER')) {
            setCurrentPage('userDashboard');
          }
        }
      } else {
        // If not authenticated, and currently on a dashboard or notifications, redirect to home
        if (isDashboardPage || currentPage === 'notifications') {
          setCurrentPage('home'); // Redirect to home if logged out from a protected page
        }
      }
    }
  }, [authLoading, isAuthenticated, user, currentPage]); // Added currentPage to dependencies

  const navigateTo = (page, data = null) => {
    console.log('App.js: Navigating to:', page, 'with data:', data);
    setCurrentPage(page);
    if (page === 'track' && data) {
      setTrackingIdFromHome(data);
    } else {
      setTrackingIdFromHome('');
    }
  };

  const renderPage = () => {
    if (authLoading) {
      console.log('App.js: Rendering LoadingSpinner...');
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-dark text-light-gray">
          Loading application...
        </div>
      );
    }

    console.log('App.js: Current Page to render:', currentPage, 'isAuthenticated:', isAuthenticated, 'user role:', user?.role);

    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'register':
        return <RegisterPage navigateTo={navigateTo} />;
      case 'userDashboard':
        // Ensure user is authenticated AND has the USER role to see this dashboard
        return isAuthenticated && user?.role === 'USER' ? <UserDashboard navigateTo={navigateTo} /> : <LoginPage navigateTo={navigateTo} />;
      case 'adminDashboard':
        // Ensure user is authenticated AND has the ADMIN role to see this dashboard
        return isAuthenticated && user?.role === 'ADMIN' ? <AdminDashboard navigateTo={navigateTo} /> : <LoginPage navigateTo={navigateTo} />;
      case 'track':
        // Allow authenticated users to access track page
        return <ParcelTrackingPage navigateTo={navigateTo} initialTrackingId={trackingIdFromHome} />;
      case 'notifications':
        // Allow authenticated users to access notifications page
        return isAuthenticated ? <NotificationsPage navigateTo={navigateTo} /> : <LoginPage navigateTo={navigateTo} />;
      case '404':
        return <NotFoundPage navigateTo={navigateTo} />;
      default:
        // Fallback for any unexpected currentPage value
        return <NotFoundPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark text-light-gray">
      {renderPage()}
    </div>
  );
}

export default App;
