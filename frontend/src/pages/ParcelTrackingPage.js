// src/pages/ParcelTrackingPage.js
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar for consistent navigation
import Footer from '../components/Footer'; // Import Footer for consistent footer
import ParcelTrackingDisplay from '../components/user/ParcelTrackingDisplay'; // Reusable component for tracking input and display

/**
 * ParcelTrackingPage component provides a dedicated page for public parcel tracking.
 * It uses the ParcelTrackingDisplay component for the actual tracking functionality.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 * @param {string} [props.initialTrackingId=''] - Optional initial tracking ID passed from the HomePage.
 */
function ParcelTrackingPage({ navigateTo, initialTrackingId = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      {/* Navbar for navigation */}
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        {/* ParcelTrackingDisplay handles the input and display.
            Pass the initialTrackingId to it if provided. */}
        <ParcelTrackingDisplay initialTrackingId={initialTrackingId} />
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default ParcelTrackingPage;
