// src/components/admin/AdminParcelManagement.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addParcel, getAllParcels, updateParcel, deleteParcel, generateNotificationDraft } from '../../services/api';
import Modal from '../Modal';
import AdminParcelForm from './AdminParcelForm';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaBell } from 'react-icons/fa';

function AdminParcelManagement() {
  const { token } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParcel, setCurrentParcel] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [notificationDraftModalOpen, setNotificationDraftModalOpen] = useState(false);
  const [notificationDraftMessage, setNotificationDraftMessage] = useState('');
  const [loadingNotificationDraft, setLoadingNotificationDraft] = useState(false);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const data = await getAllParcels(token);
      setParcels(data);
    } catch (error) {
      console.error('Error fetching parcels:', error);
      toast.error('Failed to fetch parcels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchParcels();
    }
  }, [token]);

  const handleAddClick = () => {
    setCurrentParcel(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditClick = (parcel) => {
    setCurrentParcel(parcel);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (parcelId) => {
    if (window.confirm('Are you sure you want to delete this parcel?')) {
      try {
        await deleteParcel(parcelId, token);
        toast.success('Parcel deleted successfully!');
        fetchParcels();
      } catch (error) {
        console.error('Error deleting parcel:', error);
        toast.error('Failed to delete parcel.');
      }
    }
  };

  const handleSaveParcel = async (parcelData) => {
    try {
      if (modalMode === 'add') {
        await addParcel(parcelData, token);
        toast.success('Parcel added successfully!');
      } else {
        await updateParcel(parcelData.id, parcelData, token);
        toast.success('Parcel updated successfully!');
      }
      setIsModalOpen(false);
      fetchParcels();
    } catch (error) {
      console.error('Error saving parcel:', error);
      toast.error(`Failed to save parcel: ${error.message || 'Unknown error'}`);
    }
  };

  // NEW: Handle Generate Notification Draft Click with more logging
  const handleGenerateNotificationDraftClick = async (parcel) => {
    console.log("Frontend DEBUG: handleGenerateNotificationDraftClick called.");
    console.log("Frontend DEBUG: Parcel ID:", parcel.id, "Status:", parcel.status);
    setNotificationDraftMessage('');
    setLoadingNotificationDraft(true);
    setNotificationDraftModalOpen(true); // Open modal immediately with loading
    try {
      console.log("Frontend DEBUG: Calling generateNotificationDraft API service...");
      const response = await generateNotificationDraft(parcel.id, parcel.status, token);
      console.log("Frontend DEBUG: generateNotificationDraft API service response:", response);
      setNotificationDraftMessage('Notification draft generation initiated. Check notifications page for actual message.');
      toast.success('Notification draft sent to backend for generation!');
    } catch (error) {
      console.error('Frontend ERROR: Error generating notification draft:', error);
      setNotificationDraftMessage(`Failed to generate notification: ${error.message || 'Please try again.'}`);
      toast.error('Failed to generate notification. Please try again.');
    } finally {
      setLoadingNotificationDraft(false);
      console.log("Frontend DEBUG: Notification draft generation process finished.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-xl text-white">
      <h2 className="text-3xl font-bold text-primary-green mb-6">Parcel Management</h2>

      <button
        onClick={handleAddClick}
        className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors duration-300"
      >
        <FaPlus />
        <span>Add New Parcel</span>
      </button>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No parcels found. Add one to get started!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-gray-800 border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Tracking ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Description</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Sender</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Recipient</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Current Location</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-sm text-gray-200">{parcel.trackingId}</td>
                  <td className="py-3 px-4 text-sm text-gray-200">{parcel.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${parcel.status === 'PENDING' ? 'bg-yellow-600 text-yellow-100' : ''}
                      ${parcel.status === 'IN_TRANSIT' ? 'bg-blue-600 text-blue-100' : ''}
                      ${parcel.status === 'DELIVERED' ? 'bg-green-600 text-green-100' : ''}
                      ${parcel.status === 'CANCELLED' ? 'bg-red-600 text-red-100' : ''}
                      ${parcel.status === 'RETURNED' ? 'bg-orange-600 text-orange-100' : ''}
                      ${parcel.status === 'DISPATCHED' ? 'bg-purple-600 text-purple-100' : ''}
                      ${parcel.status === 'EXCEPTION' ? 'bg-red-800 text-red-100' : ''}
                    `}>
                      {parcel.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-200">{parcel.senderFirstName} ({parcel.senderEmail})</td>
                  <td className="py-3 px-4 text-sm text-gray-200">{parcel.recipientFirstName} ({parcel.recipientEmail})</td>
                  <td className="py-3 px-4 text-sm text-gray-200">{parcel.currentLocation}, {parcel.currentCity}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditClick(parcel)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        title="Edit Parcel"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(parcel.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        title="Delete Parcel"
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        onClick={() => handleGenerateNotificationDraftClick(parcel)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                        title="Generate Notification Draft (AI)"
                      >
                        <FaBell size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Parcel' : 'Edit Parcel'}
      >
        <AdminParcelForm
          parcel={currentParcel}
          mode={modalMode}
          onSave={handleSaveParcel}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={notificationDraftModalOpen}
        onClose={() => setNotificationDraftModalOpen(false)}
        title="AI-Generated Notification Draft"
      >
        {loadingNotificationDraft ? (
          <LoadingSpinner message="Generating notification draft..." />
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-lg text-white whitespace-pre-wrap">{notificationDraftMessage}</p>
            <p className="text-sm text-gray-400 mt-4">This draft has been saved to the database. You can view it on the Notifications page.</p>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setNotificationDraftModalOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminParcelManagement;
