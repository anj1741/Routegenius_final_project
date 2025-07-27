// src/components/admin/AdminUserForm.js
import React, { useState, useEffect } from 'react';

/**
 * Helper component for Add/Edit User Form (Admin side).
 * This form is used within AdminUserManagement to create or update user accounts.
 *
 * @param {object} props - Component props.
 * @param {object} [props.user] - The user object to pre-fill the form in 'edit' mode.
 * Should match backend's UserDto structure (id, firstName, email, role).
 * @param {'add' | 'edit'} props.mode - The mode of the form ('add' for new user, 'edit' for existing).
 * @param {function} props.onSave - Callback function when the form is submitted successfully.
 * Receives the formData (matching RegisterRequest DTO).
 * @param {function} props.onCancel - Callback function when the form submission is cancelled.
 */
function AdminUserForm({ user, mode, onSave, onCancel }) {
  // Initialize form data based on the 'user' prop (for edit mode) or default empty values (for add mode)
  const [formData, setFormData] = useState(user || {
    firstName: '',
    email: '',
    password: '',
    role: 'USER' // Default role for new users as per backend
  });
  const [error, setError] = useState(''); // State to display validation errors

  // Effect to reset form data when the 'user' prop or 'mode' changes
  // This ensures the form is clean for new additions or correctly populated for edits.
  useEffect(() => {
    setFormData(user || {
      firstName: '',
      email: '',
      password: '',
      role: 'USER' // Default role for new users
    });
    setError(''); // Clear any previous errors
  }, [user, mode]);

  /**
   * Handles changes to form input fields.
   * Updates the corresponding state in formData.
   * @param {object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles the form submission.
   * Performs client-side validation and calls the onSave callback with the form data.
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Client-side validation
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.role.trim()) {
      setError('First Name, email, and role are required.');
      return;
    }
    // Password is required only when adding a new user, or if it's being changed in edit mode
    if (mode === 'add' && !formData.password.trim()) {
      setError('Password is required for new users.');
      return;
    }
    // If password is provided (either new or being changed), validate its length
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long if provided.');
      return;
    }

    // Call the onSave callback, passing the form data.
    // The parent component (AdminUserManagement) will handle the API call.
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display User ID in edit mode (read-only) */}
      {mode === 'edit' && (
        <div>
          <label htmlFor="form-id" className="block text-light-gray text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            id="form-id"
            name="id"
            value={formData.id || ''}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-light-gray cursor-not-allowed"
            readOnly
          />
        </div>
      )}
      {/* First Name Input */}
      <div>
        <label htmlFor="form-firstName" className="block text-light-gray text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          id="form-firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-primary-dark border border-gray-600 text-light-gray focus:outline-none focus:ring-1 focus:ring-primary-green"
          required
        />
      </div>
      {/* Email Input */}
      <div>
        <label htmlFor="form-email" className="block text-light-gray text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          id="form-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-primary-dark border border-gray-600 text-light-gray focus:outline-none focus:ring-1 focus:ring-primary-green"
          required
        />
      </div>
      {/* Password Input */}
      <div>
        <label htmlFor="form-password" className="block text-light-gray text-sm font-medium mb-1">
          Password {mode === 'edit' && '(leave blank to keep current)'}
        </label>
        <input
          type="password"
          id="form-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-primary-dark border border-gray-600 text-light-gray focus:outline-none focus:ring-1 focus:ring-primary-green"
          // Password is required only for 'add' mode, or if user types something in 'edit' mode
          {...(mode === 'add' && { required: true })}
        />
      </div>
      {/* Role Selection */}
      <div>
        <label htmlFor="form-role" className="block text-light-gray text-sm font-medium mb-1">Role</label>
        <select
          id="form-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-primary-dark border border-gray-600 text-light-gray focus:outline-none focus:ring-1 focus:ring-primary-green"
          required
        >
          {/* Options match your backend's Role enum */}
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Display validation error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary-green text-dark-blue-text font-semibold hover:bg-primary-green-darker transition-colors duration-300"
        >
          {mode === 'add' ? 'Add User' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default AdminUserForm;
