// src/components/Footer.js
import React from 'react';

// Footer component with copyright information
function Footer() {
  return (
    <footer className="bg-primary-dark text-medium-gray py-8 text-center border-t border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-sm mb-2">&copy; 2025 RouteMax. All rights reserved.</p>
        <p className="text-xs">Redefining the future of logistics.</p>
      </div>
    </footer>
  );
}

export default Footer;
