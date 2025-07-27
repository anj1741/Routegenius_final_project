// src/pages/RegisterPage.js
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import Notification from '../components/Notification';
import { registerUser } from '../services/api';

function RegisterPage({ navigateTo }) {
  const [notification, setNotification] = useState(null);

  const handleRegister = async (userData) => {
    try {
      await registerUser(userData);
      setNotification({ message: 'Registration successful! Please log in.', type: 'success' });
      setTimeout(() => navigateTo('login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({ message: error.message || 'Registration failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark p-4">
      <AuthForm mode="register" onSubmit={handleRegister} onSwitchMode={navigateTo} />
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

export default RegisterPage;
