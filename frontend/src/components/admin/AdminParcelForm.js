// src/components/admin/AdminParcelForm.js
import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../utils/helpers';
import { getAllUsers } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

function AdminParcelForm({ parcel, mode, onSave, onCancel }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    id: parcel?.id || null,
    senderId: parcel?.senderId || '',
    recipientId: parcel?.recipientId || '',
    senderAddress: parcel?.senderAddress || '',
    recipientAddress: parcel?.recipientAddress || '',
    senderPhone: parcel?.senderPhone || '', // ADDED
    recipientPhone: parcel?.recipientPhone || '', // ADDED
    description: parcel?.description || '',
    weight: parcel?.weight || 0.0,
    dimensionsLength: parcel?.dimensionsLength || 0.0,
    dimensionsWidth: parcel?.dimensionsWidth || 0.0,
    dimensionsHeight: parcel?.dimensionsHeight || 0.0,
    status: parcel?.status || 'PENDING',
    estimatedDeliveryDate: parcel?.estimatedDeliveryDate ? formatDateTime(parcel.estimatedDeliveryDate, 'YYYY-MM-DDTHH:mm') : '',
    currentLocation: parcel?.currentLocation || '',
    currentCity: parcel?.currentCity || '',
    currentCountry: parcel?.currentCountry || '',
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers(token);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users for parcel form:', error);
        // Handle error, e.g., show a notification
      } finally {
        setLoadingUsers(false);
      }
    };
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Update form data if parcel prop changes (for edit mode)
  useEffect(() => {
    if (parcel) {
      setFormData({
        id: parcel.id,
        senderId: parcel.senderId || '',
        recipientId: parcel.recipientId || '',
        senderAddress: parcel.senderAddress || '',
        recipientAddress: parcel.recipientAddress || '',
        senderPhone: parcel.senderPhone || '', // ADDED
        recipientPhone: parcel.recipientPhone || '', // ADDED
        description: parcel.description || '',
        weight: parcel.weight || 0.0,
        dimensionsLength: parcel.dimensionsLength || 0.0,
        dimensionsWidth: parcel.dimensionsWidth || 0.0,
        dimensionsHeight: parcel.dimensionsHeight || 0.0,
        status: parcel.status || 'PENDING',
        estimatedDeliveryDate: parcel.estimatedDeliveryDate ? formatDateTime(parcel.estimatedDeliveryDate, 'YYYY-MM-DDTHH:mm') : '',
        currentLocation: parcel.currentLocation || '',
        currentCity: parcel.currentCity || '',
        currentCountry: parcel.currentCountry || '',
      });
    }
  }, [parcel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.senderId) newErrors.senderId = 'Sender is required.';
    if (!formData.recipientId) newErrors.recipientId = 'Recipient is required.';
    if (!formData.senderAddress.trim()) newErrors.senderAddress = 'Sender address is required.';
    if (!formData.recipientAddress.trim()) newErrors.recipientAddress = 'Recipient address is required.';
    if (!formData.senderPhone.trim()) newErrors.senderPhone = 'Sender phone is required.'; // ADDED
    if (!formData.recipientPhone.trim()) newErrors.recipientPhone = 'Recipient phone is required.'; // ADDED
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (formData.weight <= 0) newErrors.weight = 'Weight must be positive.';
    if (formData.dimensionsLength <= 0) newErrors.dimensionsLength = 'Length must be positive.';
    if (formData.dimensionsWidth <= 0) newErrors.dimensionsWidth = 'Width must be positive.';
    if (formData.dimensionsHeight <= 0) newErrors.dimensionsHeight = 'Height must be positive.';
    if (!formData.currentLocation.trim()) newErrors.currentLocation = 'Current location is required.';
    if (!formData.currentCity.trim()) newErrors.currentCity = 'Current city is required.';
    if (!formData.currentCountry.trim()) newErrors.currentCountry = 'Current country is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert numeric strings to numbers for backend
      const dataToSave = {
        ...formData,
        senderId: Number(formData.senderId),
        recipientId: Number(formData.recipientId),
        weight: Number(formData.weight),
        dimensionsLength: Number(formData.dimensionsLength),
        dimensionsWidth: Number(formData.dimensionsWidth),
        dimensionsHeight: Number(formData.dimensionsHeight),
        estimatedDeliveryDate: formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate).toISOString().slice(0, 19) : null,
      };
      onSave(dataToSave);
    }
  };

  if (loadingUsers) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-light-gray">
      {/* Sender and Recipient IDs as dropdowns */}
      <div>
        <label htmlFor="senderId" className="block text-sm font-medium mb-1">Sender</label>
        <select
          id="senderId"
          name="senderId"
          value={formData.senderId}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
        >
          <option value="">Select Sender</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} ({user.email})
            </option>
          ))}
        </select>
        {errors.senderId && <p className="text-red-400 text-xs mt-1">{errors.senderId}</p>}
      </div>

      <div>
        <label htmlFor="recipientId" className="block text-sm font-medium mb-1">Recipient</label>
        <select
          id="recipientId"
          name="recipientId"
          value={formData.recipientId}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
        >
          <option value="">Select Recipient</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} ({user.email})
            </option>
          ))}
        </select>
        {errors.recipientId && <p className="text-red-400 text-xs mt-1">{errors.recipientId}</p>}
      </div>

      {/* Phone Inputs */}
      <div>
        <label htmlFor="senderPhone" className="block text-sm font-medium mb-1">Sender Phone</label>
        <input
          type="text"
          id="senderPhone"
          name="senderPhone"
          value={formData.senderPhone}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
        />
        {errors.senderPhone && <p className="text-red-400 text-xs mt-1">{errors.senderPhone}</p>}
      </div>

      <div>
        <label htmlFor="recipientPhone" className="block text-sm font-medium mb-1">Recipient Phone</label>
        <input
          type="text"
          id="recipientPhone"
          name="recipientPhone"
          value={formData.recipientPhone}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
        />
        {errors.recipientPhone && <p className="text-red-400 text-xs mt-1">{errors.recipientPhone}</p>}
      </div>

      {/* Text Inputs */}
      {[
        { id: 'senderAddress', label: 'Sender Address' },
        { id: 'recipientAddress', label: 'Recipient Address' },
        { id: 'description', label: 'Description', type: 'textarea' },
        { id: 'currentLocation', label: 'Current Location' },
        { id: 'currentCity', label: 'Current City' },
        { id: 'currentCountry', label: 'Current Country' },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium mb-1">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
            ></textarea>
          ) : (
            <input
              type="text"
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
            />
          )}
          {errors[field.id] && <p className="text-red-400 text-xs mt-1">{errors[field.id]}</p>}
        </div>
      ))}

      {/* Numeric Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.01"
            className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
          />
          {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="dimensionsLength" className="block text-sm font-medium mb-1">Length (cm)</label>
            <input
              type="number"
              id="dimensionsLength"
              name="dimensionsLength"
              value={formData.dimensionsLength}
              onChange={handleChange}
              step="0.01"
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
            />
            {errors.dimensionsLength && <p className="text-red-400 text-xs mt-1">{errors.dimensionsLength}</p>}
          </div>
          <div>
            <label htmlFor="dimensionsWidth" className="block text-sm font-medium mb-1">Width (cm)</label>
            <input
              type="number"
              id="dimensionsWidth"
              name="dimensionsWidth"
              value={formData.dimensionsWidth}
              onChange={handleChange}
              step="0.01"
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
            />
            {errors.dimensionsWidth && <p className="text-red-400 text-xs mt-1">{errors.dimensionsWidth}</p>}
          </div>
          <div>
            <label htmlFor="dimensionsHeight" className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              id="dimensionsHeight"
              name="dimensionsHeight"
              value={formData.dimensionsHeight}
              onChange={handleChange}
              step="0.01"
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
            />
            {errors.dimensionsHeight && <p className="text-red-400 text-xs mt-1">{errors.dimensionsHeight}</p>}
          </div>
        </div>
      </div>

      {/* Status Dropdown */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-green"
        >
          {['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION', 'RETURNED', 'CANCELLED'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Estimated Delivery Date */}
      <div>
        <label htmlFor="estimatedDeliveryDate" className="block text-sm font-medium mb-1">Estimated Delivery Date</label>
        <input
          type="datetime-local"
          id="estimatedDeliveryDate"
          name="estimatedDeliveryDate"
          value={formData.estimatedDeliveryDate}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 text-light-gray focus:outline-none focus:ring-1 focus:ring-primary-green"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-primary-green text-dark-blue-text font-bold hover:bg-primary-green-darker transition-colors duration-300"
        >
          {mode === 'add' ? 'Add Parcel' : 'Update Parcel'}
        </button>
      </div>
    </form>
  );
}

export default AdminParcelForm;
