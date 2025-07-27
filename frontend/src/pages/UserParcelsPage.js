    // src/pages/UserParcelsPage.js
    import React, { useEffect, useState } from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { getUserParcels } from '../services/api'; // Make sure this is imported
    import LoadingSpinner from '../components/LoadingSpinner';
    import { toast } from 'react-toastify';
    import { formatDateTime } from '../utils/helpers'; // Assuming you have this helper
    import { FaBox, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa'; // Assuming you use these icons

    function UserParcelsPage() {
      const { user, token, isAuthenticated, loading: authLoading } = useAuth();
      const [myParcels, setMyParcels] = useState([]);
      const [loadingParcels, setLoadingParcels] = useState(true);

      useEffect(() => {
        const fetchMyParcels = async () => {
          // Wait for authentication to complete and ensure user/token are available
          if (authLoading) {
            console.log("DEBUG (UserParcelsPage): Auth still loading, waiting...");
            return;
          }

          // Ensure user and token are available before attempting to fetch
          if (!isAuthenticated || !user?.id || !token) {
            console.log("DEBUG (UserParcelsPage): Not authenticated, user ID missing, or token missing. Skipping parcel fetch.");
            setLoadingParcels(false);
            // No redirect here, as this component is part of a dashboard that should already be protected
            return;
          }

          setLoadingParcels(true);
          try {
            console.log(`DEBUG (UserParcelsPage): Fetching parcels for user ID: ${user.id}`);
            const data = await getUserParcels(user.id, token); 
            console.log("DEBUG (UserParcelsPage): Parcels fetched successfully:", data);
            setMyParcels(data);
          } catch (error) {
            console.error('ERROR (UserParcelsPage): Error fetching my parcels:', error);
            toast.error('Failed to fetch your parcels.');
          } finally {
            setLoadingParcels(false);
          }
        };

        fetchMyParcels(); // Call the async function
      }, [isAuthenticated, user, token, authLoading]); // Re-run if these dependencies change

      if (loadingParcels || authLoading) { // Also check authLoading here if this component can load independently
        return <LoadingSpinner message="Loading your parcels..." />;
      }

      return (
        <div className="bg-primary-dark p-6 rounded-lg shadow-md border border-gray-700">
          {/* Main title for the section (already in UserDashboard, but kept here for self-containment) */}
          {/* <h3 className="text-2xl font-bold text-light-gray mb-4">My Parcels</h3> */}
          
          {/* Added "Your Recent Shipments" subtitle */}
          <h4 className="text-xl font-bold text-primary-green mb-4">Your Recent Shipments</h4>

          {myParcels.length === 0 ? (
            // Styled block for "No parcels" message
            <div className="bg-card-dark p-5 rounded-lg shadow-inner border border-gray-600 text-center text-medium-gray py-8">
              <p>You have no parcels associated with your account.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myParcels.map((parcel) => (
                <div key={parcel.id} className="bg-card-dark p-5 rounded-lg shadow-inner border border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p className="flex items-center"><FaBox className="mr-2 text-primary-green" /> <span className="font-semibold">Tracking ID:</span> {parcel.trackingId}</p>
                    <p className="flex items-center"><FaBox className="mr-2 text-primary-green" /> <span className="font-semibold">Description:</span> {parcel.description}</p>
                    <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary-green" /> <span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${parcel.status === 'PENDING' ? 'bg-yellow-600 text-yellow-100' : ''}
                      ${parcel.status === 'IN_TRANSIT' ? 'bg-blue-600 text-blue-100' : ''}
                      ${parcel.status === 'DELIVERED' ? 'bg-green-600 text-green-100' : ''}
                      ${parcel.status === 'CANCELLED' ? 'bg-red-600 text-red-100' : ''}
                      ${parcel.status === 'RETURNED' ? 'bg-orange-600 text-orange-100' : ''}
                      ${parcel.status === 'DISPATCHED' ? 'bg-purple-600 text-purple-100' : ''}
                      ${parcel.status === 'EXCEPTION' ? 'bg-red-800 text-red-100' : ''}
                    `}>
                      {parcel.status.replace('_', ' ')}
                    </span></p>
                    <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary-green" /> <span className="font-semibold">Current Location:</span> {parcel.currentLocation}, {parcel.currentCity}</p>
                    <p className="flex items-center"><FaCalendarAlt className="mr-2 text-primary-green" /> <span className="font-semibold">Estimated Delivery:</span> {parcel.estimatedDeliveryDate ? formatDateTime(parcel.estimatedDeliveryDate, 'YYYY-MM-DD') : 'N/A'}</p>
                    <p className="flex items-center"><FaClock className="mr-2 text-primary-green" /> <span className="font-semibold">Last Updated:</span> {formatDateTime(parcel.lastUpdatedAt, 'YYYY-MM-DD HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    export default UserParcelsPage;
    