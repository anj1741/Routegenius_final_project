// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to manage and provide authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!token;
  const [loading, setLoading] = useState(true);

  // Function to save auth data to localStorage
  const saveAuthData = useCallback((userData, jwtToken) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
      setUser(userData);
      setToken(jwtToken);
      console.log('AuthContext: Data SAVED to localStorage and state updated.', { userData, jwtToken });
    } catch (error) {
      console.error('AuthContext: Failed to save auth data to localStorage:', error);
    }
  }, []);

  // Function to load auth data from localStorage on component mount
  const loadAuthData = useCallback(() => {
    console.log('AuthContext: Attempting to load auth data from localStorage...');
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log('AuthContext: Data LOADED from localStorage.', { parsedUser, storedToken });
      } else {
        console.log('AuthContext: No auth data found in localStorage.');
      }
    } catch (error) {
      console.error('AuthContext: Failed to parse auth data from localStorage (corrupted data?):', error);
      // Clear corrupted data if any
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null); // Ensure state is cleared if data is bad
      setToken(null);
    } finally {
      setLoading(false); // Set loading to false after attempt to load data
      console.log('AuthContext: Loading complete. isAuthenticated:', !!token);
    }
  }, [token]); // Added token to dependency array to re-evaluate loadAuthData if token changes outside this effect (though it shouldn't)

  // Function to handle user login
  const login = useCallback((userData, jwtToken) => {
    console.log('AuthContext: Login called with:', { userData, jwtToken });
    saveAuthData(userData, jwtToken);
  }, [saveAuthData]);

  // Function to handle user logout
  const logout = useCallback(() => {
    console.log('AuthContext: Logout called.');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }, []);

  // Effect to load auth data when the component mounts
  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]); // Dependency array for useCallback: re-create if 'loadAuthData' changes

  // Log current auth state when it changes
  useEffect(() => {
    console.log('AuthContext State Changed: isAuthenticated:', isAuthenticated, 'User:', user, 'Token present:', !!token, 'Loading:', loading);
  }, [isAuthenticated, user, token, loading]);


  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = React.useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  }), [user, token, isAuthenticated, loading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
