// src/components/admin/AdminUserManagement.js
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import Notification from '../Notification'; // Import Notification for user feedback
import Modal from '../Modal'; // Import Modal for add/edit forms
import LoadingSpinner from '../LoadingSpinner'; // Import LoadingSpinner for loading state
import AdminUserForm from './AdminUserForm'; // Import the form component for user add/edit
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to get authentication token
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/api'; // Import API functions

/**
 * AdminUserManagement component allows administrators to manage user accounts.
 * This includes viewing, adding, editing, and deleting users.
 */
function AdminUserManagement() {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [notification, setNotification] = useState(null); // State for displaying temporary notifications
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [currentUser, setCurrentUser] = useState(null); // State to hold user data for editing/adding
  const [modalMode, setModalMode] = useState('add'); // State to determine modal mode: 'add' or 'edit'
  const { token } = useAuth(); // Get the authentication token from AuthContext

  /**
   * Function to fetch all users from the backend API.
   * This is wrapped in useCallback to prevent it from changing on every render,
   * which would cause useEffect to re-run unnecessarily.
   */
  const fetchUsers = useCallback(async () => {
    if (!token) {
      // If no token, user is not authenticated, so cannot fetch users.
      setNotification({ message: 'Authentication required to fetch users.', type: 'error' });
      setLoading(false);
      return;
    }
    setLoading(true); // Set loading to true before API call
    try {
      const data = await getAllUsers(token); // Call the API to get all users
      setUsers(data); // Update the users state
      setNotification({ message: 'Users loaded successfully!', type: 'success' }); // Show success notification
    } catch (error) {
      console.error('Error fetching users:', error);
      // Show error notification with message from API or a generic one
      setNotification({ message: error.message || 'Failed to load users.', type: 'error' }); // Show error
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  }, [token]); // Dependency array for useCallback: re-create if 'token' changes

  // useEffect hook to fetch users when the component mounts or the token changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Dependency array: now depends on the memoized fetchUsers function

  /**
   * Handles the click event for adding a new user.
   * Sets the modal mode to 'add' and opens the modal with an empty user object.
   */
  const handleAddUserClick = () => {
    // Initialize with default values for a new user, matching RegisterRequest DTO
    setCurrentUser({ firstName: '', email: '', password: '', role: 'USER' }); // Default role 'USER'
    setModalMode('add');
    setIsModalOpen(true);
  };

  /**
   * Handles the click event for editing an existing user.
   * Sets the modal mode to 'edit' and opens the modal with the selected user's data.
   * @param {object} user - The user object to be edited.
   */
  const handleEditUserClick = (user) => {
    // Copy user data, but clear password for security.
    // Ensure role is correctly passed as string (e.g., 'USER', 'ADMIN')
    setCurrentUser({ ...user, password: '' });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  /**
   * Handles the deletion of a user.
   * Prompts for confirmation and then calls the backend API to delete the user.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleDeleteUser = async (userId) => {
    // Using window.confirm for simplicity, but a custom Modal should be used in a production app.
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteUser(userId, token); // Call the API to delete the user
      setNotification({ message: 'User deleted successfully!', type: 'success' }); // Show success
      fetchUsers(); // Re-fetch users to update the list in the UI
    } catch (error) {
      console.error('Error deleting user:', error);
      setNotification({ message: error.message || 'Failed to delete user.', type: 'error' }); // Show error
    }
  };

  /**
   * Handles saving a user (either adding a new one or updating an existing one).
   * Calls the appropriate backend API based on the modalMode.
   * @param {object} userData - The user data to save.
   */
  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === 'add') {
        // For adding, userData should match RegisterRequest: { firstName, email, password, role }
        await createUser(userData, token);
        setNotification({ message: 'User added successfully!', type: 'success' });
      } else {
        // For updating, userData should match RegisterRequest (for update) + ID: { id, firstName, email, password (optional), role }
        await updateUser(userData.id, userData, token);
        setNotification({ message: 'User updated successfully!', type: 'success' });
      }
      setIsModalOpen(false); // Close the modal
      fetchUsers(); // Re-fetch users to update the list
    } catch (error) {
      console.error('Error saving user:', error);
      setNotification({ message: error.message || 'Failed to save user.', type: 'error' });
    }
  };

  // Show loading spinner while users are being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-primary-dark p-6 rounded-lg shadow-inner border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary-green">User Management</h3>
        {/* Button to open the Add User modal */}
        <button
          onClick={handleAddUserClick}
          className="bg-primary-green text-dark-blue-text px-4 py-2 rounded-lg shadow-md hover:bg-primary-green-darker transition-colors duration-300 font-semibold flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add User</span>
        </button>
      </div>

      {users.length === 0 ? (
        // Message displayed if no users are found
        <p className="text-center text-medium-gray py-4">No users found.</p>
      ) : (
        // Table to display user details
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card-dark rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-light-gray">ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-light-gray">First Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-light-gray">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-light-gray">Role</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-light-gray">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800">
                  <td className="py-3 px-4 text-light-gray text-sm">{user.id}</td>
                  <td className="py-3 px-4 text-light-gray">{user.firstName}</td>
                  <td className="py-3 px-4 text-light-gray">{user.email}</td>
                  <td className="py-3 px-4 text-light-gray capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    {/* Edit User Button */}
                    <button
                      onClick={() => handleEditUserClick(user)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                      title="Edit User"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {/* Delete User Button */}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Delete User"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal when requested
        title={modalMode === 'add' ? 'Add New User' : 'Edit User'}
      >
        {/* Render the AdminUserForm inside the modal, passing current user data and mode */}
        <AdminUserForm
          user={currentUser}
          mode={modalMode}
          onSave={handleSaveUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {notification && (
        // Display notification if there's a message
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)} // Clear notification when closed
        />
      )}
    </div>
  );
}

export default AdminUserManagement;
