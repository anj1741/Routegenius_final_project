// src/components/user/ParcelTrackingDisplay.js
import React, { useState, useEffect } from 'react';
import { trackParcel } from '../../services/api'; // Use the common API service
import Notification from '../Notification'; // Import Notification for user feedback
import LoadingSpinner from '../LoadingSpinner'; // Import LoadingSpinner for loading state
import { formatDateTime } from '../../utils/helpers'; // Import helper for date formatting

/**
 * ParcelTrackingDisplay component for displaying details of a tracked parcel.
 * This component is reusable for both public tracking on the homepage and quick tracking on dashboards.
 *
 * @param {object} props - Component props.
 * @param {string} [props.initialTrackingId=''] - Optional initial tracking ID to pre-fill the input and trigger a search.
 */
function ParcelTrackingDisplay({ initialTrackingId = '' }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId); // State for the input field
  const [parcelDetails, setParcelDetails] = useState(null); // State to store fetched parcel details
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [notification, setNotification] = useState(null); // State for displaying temporary notifications

  // useEffect hook to trigger a parcel track if an initialTrackingId is provided.
  // This is useful when navigating from the HeroSection with a pre-filled ID.
  useEffect(() => {
    if (initialTrackingId) {
      handleTrackParcelInternal(initialTrackingId);
    }
  }, [initialTrackingId]); // Dependency array: re-run effect if 'initialTrackingId' changes

  /**
   * Internal function to handle the actual API call for tracking a parcel.
   * @param {string} idToTrack - The tracking ID to search for.
   */
  const handleTrackParcelInternal = async (idToTrack) => {
    if (!idToTrack) {
      setNotification({ message: 'Please enter a tracking ID.', type: 'error' });
      return;
    }

    setLoading(true); // Set loading to true before API call
    setParcelDetails(null); // Clear any previously displayed parcel details
    setNotification(null); // Clear any previous notifications

    try {
      // Call the public trackParcel API function (no token needed for this endpoint)
      const data = await trackParcel(idToTrack);
      setParcelDetails(data); // Update state with fetched parcel details
      setNotification({ message: 'Parcel details fetched successfully!', type: 'success' }); // Show success
    } catch (error) {
      console.error('Error tracking parcel:', error);
      // Show error notification with message from API or a generic one
      setNotification({ message: error.message || 'Failed to track parcel. Please check the ID.', type: 'error' });
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  };

  /**
   * Handles the form submission (e.g., when the "Track Parcel" button is clicked).
   * Calls the internal tracking function with the current input value.
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackParcelInternal(trackingId);
  };

  return (
    <div className="bg-primary-dark p-6 rounded-lg shadow-inner border border-gray-700">
      <h3 className="text-2xl font-bold text-primary-green mb-4">Track Your Parcel</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter tracking ID"
          className="flex-grow p-3 rounded-lg bg-card-dark border border-gray-600 text-light-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-primary-green text-dark-blue-text px-6 py-3 rounded-lg shadow-md hover:bg-primary-green-darker transition-colors duration-300 font-semibold flex items-center justify-center space-x-2"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <LoadingSpinner size="sm" color="dark-blue-text" /> // Show small spinner in button
          ) : (
            <i className="fas fa-search"></i> // Search icon
          )}
          <span>{loading ? 'Tracking...' : 'Track Parcel'}</span>
        </button>
      </form>

      {/* Display parcel details if available */}
      {parcelDetails && (
        <div className="bg-card-dark p-6 rounded-lg shadow-md border border-gray-700">
          <h4 className="text-xl font-bold text-light-gray mb-3">Parcel Details:</h4>
          <p className="text-medium-gray mb-2"><strong>Tracking ID:</strong> <span className="text-primary-green">{parcelDetails.trackingId}</span></p>
          {/* Display sender and recipient names as per ParcelResponse DTO */}
          <p className="text-medium-gray mb-2"><strong>Sender:</strong> {parcelDetails.senderFirstName} ({parcelDetails.senderAddress})</p>
          <p className="text-medium-gray mb-2"><strong>Recipient:</strong> {parcelDetails.recipientFirstName} ({parcelDetails.recipientAddress})</p>
          <p className="text-medium-gray mb-2"><strong>Description:</strong> {parcelDetails.description}</p>
          <p className="text-medium-gray mb-2"><strong>Current Status:</strong> <span className="font-semibold text-primary-green">{parcelDetails.status}</span></p>
          {/* Format lastUpdatedAt using the helper function */}
          <p className="text-medium-gray mb-2"><strong>Last Updated:</strong> {formatDateTime(parcelDetails.lastUpdatedAt)}</p>
          {/* Add more details as per your ParcelResponse DTO */}
          {parcelDetails.currentLocation && <p className="text-medium-gray mb-2"><strong>Location:</strong> {parcelDetails.currentLocation}, {parcelDetails.currentCity}, {parcelDetails.currentCountry}</p>}
          {parcelDetails.estimatedDeliveryDate && <p className="text-medium-gray mb-2"><strong>Estimated Delivery:</strong> {formatDateTime(parcelDetails.estimatedDeliveryDate)}</p>}
          {parcelDetails.actualDeliveryDate && <p className="text-medium-gray mb-2"><strong>Actual Delivery:</strong> {formatDateTime(parcelDetails.actualDeliveryDate)}</p>}
        </div>
      )}

      {notification && (
        // Display general app notifications
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)} // Clear notification when closed
        />
      )}
    </div>
  );
}

export default ParcelTrackingDisplay;
