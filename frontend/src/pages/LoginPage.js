// src/pages/LoginPage.js
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, loginAdmin } from '../services/api';

function LoginPage({ navigateTo }) {
  const [currentAuthView, setCurrentAuthView] = useState('choice');
  const [notification, setNotification] = useState(null);
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleUserLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      // Pass the full user object and token to the AuthContext login function
      login({ id: response.id, firstName: response.firstName, email: response.email, role: response.roles[0] }, response.token);
      setNotification({ message: 'User login successful!', type: 'success' });
      // IMPORTANT: navigateTo is NOT called here. App.js will react to AuthContext state change.
    } catch (error) {
      console.error('User login error:', error);
      setNotification({ message: error.message || 'User login failed. Please check your credentials.', type: 'error' });
    }
  };

  const handleAdminLogin = async (email, password) => {
    try {
      const response = await loginAdmin(email, password);
      // Pass the full user object and token to the AuthContext login function
      login({ id: response.id, firstName: response.firstName, email: response.email, role: response.roles[0] }, response.token);
      setNotification({ message: 'Admin login successful!', type: 'success' });
      // IMPORTANT: navigateTo is NOT called here. App.js will react to AuthContext state change.
    } catch (error) {
      console.error('Admin login error:', error);
      setNotification({ message: error.message || 'Admin login failed. Please check your credentials.', type: 'error' });
    }
  };

  const renderAuthComponent = () => {
    switch (currentAuthView) {
      case 'user':
        return <AuthForm mode="login" onSubmit={handleUserLogin} onSwitchMode={setCurrentAuthView} />;
      case 'admin':
        return <AuthForm mode="login" onSubmit={handleAdminLogin} isAdmin={true} onSwitchMode={setCurrentAuthView} />;
      case 'choice':
      default:
        return (
          <div className="bg-card-dark p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-primary-green mb-6">Welcome to RouteMax</h2>
            <p className="text-light-gray mb-8">Please select your login type:</p>

            <div className="space-y-4">
              <button
                onClick={() => setCurrentAuthView('user')}
                className="w-full bg-primary-green text-dark-blue-text font-bold py-3 rounded-lg shadow-md hover:bg-primary-green-darker transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-user text-xl"></i>
                <span>User Login</span>
              </button>
              <button
                onClick={() => setCurrentAuthView('admin')}
                className="w-full bg-gray-700 text-light-gray font-bold py-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-user-shield text-xl"></i>
                <span>Admin Login</span>
              </button>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigateTo('register')}
                className="text-primary-green hover:underline text-sm"
              >
                Don't have an account? Register here.
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark p-4">
      {renderAuthComponent()}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default LoginPage;
