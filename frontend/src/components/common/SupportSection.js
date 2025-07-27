// src/components/common/SupportSection.js
import React from 'react';

/**
 * SupportSection component for dedicated support information.
 * This section is displayed on the HomePage.
 */
function SupportSection() {
  return (
    <section className="py-20 bg-primary-dark text-light-gray">
      <div className="container mx-auto px-4 text-center">
        {/* Grid for the support card - centered using md:col-start-2 for a single card in a 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {/* Dedicated Support Card */}
          <div className="bg-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center md:col-start-2 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-green text-dark-blue-text p-4 rounded-full mb-6">
              <i className="fas fa-users text-3xl"></i> {/* Users icon for support */}
            </div>
            <h4 className="text-2xl font-bold mb-3">Dedicated Support</h4>
            <p className="text-medium-gray leading-relaxed">
              Our support team is available 24/7 to help with any of your queries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportSection;
