// src/components/common/FeaturesSection.js
import React from 'react';

/**
 * FeaturesSection component to highlight key advantages and services of RouteMax.
 * This section is displayed on the HomePage.
 */
function FeaturesSection() {
  return (
    <section className="py-20 bg-primary-dark text-light-gray">
      <div className="container mx-auto px-4 text-center">
        {/* Section Heading */}
        <h2 className="text-lg font-semibold text-primary-green mb-2">THE ROUTEMAX ADVANTAGE</h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-12">Why Settle for Less?</h3>

        {/* Grid for feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1: Hyper-Fast Tracking */}
          <div className="bg-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-green text-dark-blue-text p-4 rounded-full mb-6">
              <i className="fas fa-bolt text-3xl"></i> {/* Bolt icon for speed */}
            </div>
            <h4 className="text-2xl font-bold mb-3">Hyper-Fast Tracking</h4>
            <p className="text-medium-gray leading-relaxed">
              Get instant, real-time updates on your shipment's location and status.
            </p>
          </div>

          {/* Feature Card 2: Fort-Knox Security */}
          <div className="bg-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-green text-dark-blue-text p-4 rounded-full mb-6">
              <i className="fas fa-shield-alt text-3xl"></i> {/* Shield icon for security */}
            </div>
            <h4 className="text-2xl font-bold mb-3">Fort-Knox Security</h4>
            <p className="text-medium-gray leading-relaxed">
              Your parcels are handled with top-tier security protocols from start to finish.
            </p>
          </div>

          {/* Feature Card 3: Automated Notifications */}
          <div className="bg-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-green text-dark-blue-text p-4 rounded-full mb-6">
              <i className="fas fa-bell text-3xl"></i> {/* Bell icon for notifications */}
            </div>
            <h4 className="text-2xl font-bold mb-3">Automated Notifications</h4>
            <p className="text-medium-gray leading-relaxed">
              Stay informed with real-time alerts on every status change of your parcel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
