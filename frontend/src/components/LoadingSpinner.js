// src/components/LoadingSpinner.js
import React from 'react';

// A simple loading spinner component
// It uses Font Awesome's fa-spinner icon and Tailwind CSS for styling.
// Props:
//   size: 'sm', 'md', 'lg', 'xl' (controls the size of the spinner)
//   color: Tailwind color class (e.g., 'primary-green', 'white', 'blue-500')
function LoadingSpinner({ size = 'md', color = 'primary-green' }) {
  let spinnerSizeClass = '';
  switch (size) {
    case 'sm':
      spinnerSizeClass = 'w-6 h-6';
      break;
    case 'lg':
      spinnerSizeClass = 'w-12 h-12';
      break;
    case 'xl':
      spinnerSizeClass = 'w-16 h-16';
      break;
    case 'md':
    default:
      spinnerSizeClass = 'w-8 h-8';
      break;
  }

  return (
    <div className="flex justify-center items-center">
      {/* The spinner animation is created using border styles and animate-spin */}
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-${color}-500 border-opacity-25 border-t-${color} ${spinnerSizeClass}`}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
