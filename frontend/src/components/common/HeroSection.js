// src/components/HeroSection.js
import React, { useState } from 'react';

/**
 * HeroSection component for the main landing page.
 * Features a tracking input and calls navigateTo for tracking.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function HeroSection({ navigateTo }) {
  const [trackingId, setTrackingId] = useState('');

  const handleTrack = () => {
    if (trackingId.trim()) {
      navigateTo('track', trackingId.trim());
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-dark to-dark-blue-bg text-light-gray py-20 md:py-32 flex items-center justify-center">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-green mb-6 leading-tight">
          Your Parcel, Our Priority
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
          Experience seamless and reliable delivery services. Track your packages in real-time.
        </p>

        {/* Tracking Input */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full md:w-2/3 p-4 rounded-lg bg-card-dark border border-gray-700 text-light-gray placeholder-medium-gray focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <button
            onClick={handleTrack}
            className="w-full md:w-1/3 bg-primary-green text-dark-blue-text font-bold py-4 rounded-lg shadow-lg hover:bg-primary-green-darker transition-colors duration-300"
          >
            Track Now
          </button>
        </div>

        <div className="mt-12">
          <button
            onClick={() => navigateTo('register')}
            className="text-primary-green text-lg font-semibold hover:underline transition-colors duration-300"
          >
            New to RouteMax? Register Today!
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
