// src/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar for consistent navigation
import Footer from '../components/Footer'; // Import Footer for consistent footer
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner for loading state
import Notification from '../components/Notification'; // Import Notification for user feedback (assuming this is a custom component)
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get user and token
import { getUserNotifications, markNotificationAsRead, deleteNotification } from '../services/api'; // Import API functions
import { toast } from 'react-toastify'; // <<< ADDED THIS IMPORT for toast
import { FaCheckCircle, FaTrash } from 'react-icons/fa'; // <<< ADDED THESE IMPORTS for icons

/**
 * NotificationsPage component displays a list of notifications for the logged-in user.
 * It fetches notifications from the backend and presents them in a user-friendly format.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation between pages.
 */
function NotificationsPage({ navigateTo }) {
  // Get user, token, authentication status, and auth loading state from AuthContext
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]); // State to store the fetched notifications
  const [loading, setLoading] = useState(true); // State to manage loading status for notifications
  const [notificationMessage, setNotificationMessage] = useState(null); // State for displaying temporary notifications

  // Helper function to format date and time (assuming it's in utils/helpers.js)
  // If you don't have this, you might need to add it or remove its usage.
  const formatDateTime = (isoString, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!isoString) return 'N/A';

    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (format === 'YYYY-MM-DD HH:mm') {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    }
    if (format === 'HH:mm') {
      return `${hours}:${minutes}`;
    }
    // Default format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  // useEffect hook to fetch user's notifications when the component mounts or auth state changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (authLoading) {
        console.log("Frontend DEBUG (NotificationsPage): Auth still loading, waiting...");
        return; // Wait for authentication to finish loading
      }

      // If not authenticated or token data is missing, stop loading and redirect
      if (!isAuthenticated || !token) {
        console.log("Frontend DEBUG (NotificationsPage): Not authenticated or token missing. Redirecting to login.");
        setNotificationMessage({ message: 'Please log in to view notifications.', type: 'info' });
        setLoading(false);
        navigateTo('login'); // Redirect to login page
        return;
      }

      setLoading(true); // Set loading to true before fetching data
      try {
        console.log("Frontend DEBUG (NotificationsPage): Attempting to fetch notifications with token:", token ? "present" : "missing");
        const data = await getUserNotifications(token); 
        setNotifications(data); // Update notifications state with fetched data
        // setNotificationMessage({ message: 'Notifications loaded.', type: 'success' }); // No need for this toast on success
      } catch (error) {
        console.error('Frontend ERROR (NotificationsPage): Error fetching notifications:', error);
        // Show error notification
        toast.error(error.message || 'Failed to load notifications.'); // Corrected: using toast here
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
        console.log("Frontend DEBUG (NotificationsPage): fetchNotifications finished.");
      }
    };

    fetchNotifications(); // Execute the fetch function
  }, [isAuthenticated, token, authLoading, navigateTo]); // Dependencies: re-run effect if these values change

  // Handlers for marking as read and deleting notifications
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId, token);
      toast.success('Notification marked as read!');
      // Re-fetch notifications to update the UI
      const updatedNotifications = await getUserNotifications(token);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(notificationId, token);
        toast.success('Notification deleted successfully!');
        // Re-fetch notifications to update the UI
        const updatedNotifications = await getUserNotifications(token);
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification.');
      }
    }
  };

  // Show loading spinner while authentication or notifications are being fetched
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      {/* Navbar for consistent navigation */}
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8 pt-20"> {/* Added pt-20 for navbar */}
        <div className="bg-card-dark rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-primary-green mb-6 border-b border-gray-700 pb-4">
            Your Notifications
          </h2>

          {notifications.length === 0 ? (
            // Message displayed if no notifications are found
            <p className="text-center text-medium-gray py-8">No notifications found.</p>
          ) : (
            // Display notifications in a list
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 rounded-lg shadow-inner border 
                  ${notif.isRead ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-cyan-800 border-cyan-700 text-white'}
                  flex items-start justify-between
                `}>
                  <div className="flex-grow">
                    <p className="font-semibold text-lg mb-1">{notif.message}</p>
                    <p className="text-sm text-gray-300">
                      Related Parcel: <span className="font-mono text-primary-green">{notif.parcelId}</span> | Status: {notif.relatedStatus.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-medium-gray mt-1">
                      Received: {formatDateTime(notif.timestamp, 'YYYY-MM-DD HH:mm')}
                    </p>
                  </div>
                  <div className="flex space-x-3 ml-4">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-green-400 hover:text-green-300 transition-colors duration-200"
                        title="Mark as Read"
                      >
                        <FaCheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Delete Notification"
                    >
                        <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Footer for consistent layout */}
      <Footer />
      {notificationMessage && (
        // Display general app notifications (using your Notification component)
        <Notification
          message={notificationMessage.message}
          type={notificationMessage.type}
          onClose={() => setNotificationMessage(null)} // Clear notification when closed
        />
      )}
    </div>
  );
}

export default NotificationsPage;
