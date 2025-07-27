    // src/components/AuthForm.js
    import React, { useState, useEffect } from 'react';
    // Assuming you have these icons or similar ones in your project
    // If not, you might need to install 'react-icons' (npm install react-icons)
    // or remove the icon elements from the JSX.
    import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'; 

    /**
     * Reusable authentication form for login and registration.
     * This component handles input fields, local validation, and form submission.
     *
     * @param {object} props - Component props.
     * @param {'login' | 'register'} props.mode - The mode of the form ('login' or 'register').
     * @param {function} props.onSubmit - Callback function when the form is submitted.
     * For 'login' mode: onSubmit(email, password)
     * For 'register' mode: onSubmit({ firstName, email, password, role })
     * @param {function} [props.onSwitchMode] - Optional callback to switch between login/register modes or back to choice.
     * Passed the new mode string (e.g., 'login', 'register', 'choice').
     * @param {string} [props.initialEmail=''] - Initial value for the email field.
     * @param {string} [props.initialPassword=''] - Initial value for the password field.
     * @param {boolean} [props.isAdmin=false] - If true, customizes labels for admin login.
     */
    function AuthForm({ mode, onSubmit, onSwitchMode, initialEmail = '', initialPassword = '', isAdmin = false }) {
      const [firstName, setFirstName] = useState(''); // For registration
      const [email, setEmail] = useState(initialEmail);
      const [password, setPassword] = useState(initialPassword);
      const [confirmPassword, setConfirmPassword] = useState('');
      const [error, setError] = useState('');

      // Reset form fields and error when mode or initial values change
      useEffect(() => {
        setFirstName(''); // Always clear first name on mode change
        setEmail(initialEmail);
        setPassword(initialPassword);
        setConfirmPassword(''); // Always clear confirm password
        setError('');
      }, [mode, initialEmail, initialPassword]);

      const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors on new submission attempt

        // Basic client-side validation for email and password
        if (!email.trim() || !password.trim()) {
          setError('Email and password are required.');
          return;
        }

        if (mode === 'register') {
          if (!firstName.trim()) {
            setError('First Name is required for registration.');
            return;
          }
          if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
          }
          if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
          }
          // Call onSubmit with registration data for user role (ROLE_USER as per backend)
          onSubmit({ firstName: firstName.trim(), email: email.trim(), password: password.trim(), role: 'USER' }); 
        } else { // mode === 'login'
          // Call onSubmit with login credentials (email and password)
          onSubmit(email.trim(), password.trim());
        }
      };

      // Dynamic text for titles and buttons
      const title = isAdmin ? 'Admin Login' : (mode === 'login' ? 'User Login' : 'User Registration');
      const submitButtonText = isAdmin ? 'Login as Admin' : (mode === 'login' ? 'Login' : 'Register');

      return (
        <div className="bg-card-dark p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-primary-green mb-6 text-center">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label htmlFor="firstName" className="block text-light-gray text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-3 pl-10 rounded-lg bg-primary-dark border border-gray-700 text-light-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-light-gray text-sm font-medium mb-2">
                {isAdmin ? 'Admin Email' : 'Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 pl-10 rounded-lg bg-primary-dark border border-gray-700 text-light-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email" // Helps browsers with autofill
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-light-gray text-sm font-medium mb-2">
                {isAdmin ? 'Admin Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 pl-10 rounded-lg bg-primary-dark border border-gray-700 text-light-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  // Autocomplete hints for browsers
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirm-password" className="block text-light-gray text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    className="w-full p-3 pl-10 rounded-lg bg-primary-dark border border-gray-700 text-light-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary-green text-dark-blue-text font-bold py-3 rounded-lg shadow-md hover:bg-primary-green-darker transition-colors duration-300"
            >
              {submitButtonText}
            </button>
          </form>

          {/* Conditional links for switching between login/register or back to choices */}
          {onSwitchMode && (
            <div className="mt-6 text-center">
              {mode === 'login' && !isAdmin && ( // Only show register link for user login form
                <button
                  onClick={() => onSwitchMode('register')}
                  className="text-primary-green hover:underline text-sm"
                >
                  Don't have an account? Register here.
                </button>
              )}
              {mode === 'register' && ( // Show login link for register form
                <button
                  onClick={() => onSwitchMode('login')}
                  className="text-primary-green hover:underline text-sm"
                >
                  Already have an account? Login here.
                </button>
              )}
              {/* Show "Back to Login Choices" for ALL login and register modes */}
              {mode === 'login' || mode === 'register' ? (
                <button
                  onClick={() => onSwitchMode('choice')}
                  className="text-blue-400 hover:underline text-sm mt-2 block" // Changed color to blue-400 for consistency
                >
                  &larr; Back to Login Choices
                </button>
              ) : null}
            </div>
          )}
        </div>
      );
    }

    export default AuthForm;
    