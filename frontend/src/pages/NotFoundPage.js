// src/pages/NotFoundPage.js
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar for consistent navigation
import Footer from '../components/Footer'; // Import Footer for consistent footer

/**
 * NotFoundPage component displays a 404 error when a route is not found.
 * It provides a link to navigate back to the homepage.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function NotFoundPage({ navigateTo }) {
  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      {/* Navbar for consistent navigation */}
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        {/* Large 404 heading */}
        <h1 className="text-6xl font-extrabold text-primary-green mb-4">404</h1>
        {/* Page Not Found message */}
        <h2 className="text-3xl font-bold text-light-gray mb-6">Page Not Found</h2>
        {/* Informative message */}
        <p className="text-lg text-medium-gray mb-8">
          The page you are looking for does not exist or an error occurred.
        </p>
        {/* Button to navigate to the homepage */}
        <button
          onClick={() => navigateTo('home')}
          className="bg-primary-green text-dark-blue-text px-6 py-3 rounded-lg shadow-md hover:bg-primary-green-darker transition-colors duration-300 font-semibold"
        >
          Go to Homepage
        </button>
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default NotFoundPage;
