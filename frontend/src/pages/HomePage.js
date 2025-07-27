// src/pages/HomePage.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/common/HeroSection'; // Assuming you have this component for the main landing page content

/**
 * HomePage component serves as the main landing page of the application.
 * It includes a Navbar, a Hero section, and a Footer.
 *
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle navigation to other pages.
 */
function HomePage({ navigateTo }) {
  return (
    <div className="min-h-screen flex flex-col bg-primary-dark text-light-gray">
      {/* Navbar for navigation */}
      <Navbar navigateTo={navigateTo} />
      <main className="flex-grow">
        {/* Hero Section - main content of the home page */}
        <HeroSection navigateTo={navigateTo} />
        {/* You can add more sections here like About, Services, Features etc. */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-green mb-8">Why Choose RouteMax?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card-dark p-6 rounded-lg shadow-lg">
              <i className="fas fa-shipping-fast text-5xl text-primary-green mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-medium-gray">Experience rapid deliveries with our optimized routes.</p>
            </div>
            <div className="bg-card-dark p-6 rounded-lg shadow-lg">
              <i className="fas fa-map-marked-alt text-5xl text-primary-green mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-medium-gray">Monitor your parcels every step of the way.</p>
            </div>
            <div className="bg-card-dark p-6 rounded-lg shadow-lg">
              <i className="fas fa-shield-alt text-5xl text-primary-green mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-medium-gray">Your packages are handled with utmost care and security.</p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default HomePage;
