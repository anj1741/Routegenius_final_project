// src/components/Notification.js
import React, { useState, useEffect } from 'react';

/**
 * A reusable Notification component for displaying temporary messages (success, error, info).
 * It automatically hides after a few seconds.
 *
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display.
 * @param {'success' | 'error' | 'info'} props.type - The type of notification (determines styling).
 * @param {function} props.onClose - Callback function when the notification is closed or hides.
 */
function Notification({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically hide the notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 5000); // 5 seconds

    // Cleanup: Clear the timer if the component unmounts or if message/type/onClose changes
    return () => clearTimeout(timer);
  }, [message, type, onClose]); // Re-run effect if these props change

  // If not visible, render nothing
  if (!isVisible) {
    return null;
  }

  // Determine background and text color based on the notification type
  let bgColorClass = '';
  let textColorClass = '';
  switch (type) {
    case 'success':
      bgColorClass = 'bg-green-600';
      textColorClass = 'text-white';
      break;
    case 'error':
      bgColorClass = 'bg-red-600';
      textColorClass = 'text-white';
      break;
    case 'info':
      bgColorClass = 'bg-blue-600';
      textColorClass = 'text-white';
      break;
    default:
      bgColorClass = 'bg-gray-700'; // Default gray for unknown types
      textColorClass = 'text-white';
  }

  return (
    // Fixed position at the bottom-right of the screen, with styling for visibility and appearance
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl z-50 flex items-center space-x-3 ${bgColorClass} ${textColorClass}`}>
      {/* Icon based on notification type */}
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'} text-xl`}></i>
      {/* The notification message */}
      <p className="font-medium">{message}</p>
      {/* Manual close button */}
      <button
        onClick={() => {
          setIsVisible(false); // Hide immediately on click
          if (onClose) onClose(); // Call the onClose callback if provided
        }}
        className="ml-4 text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        <i className="fas fa-times"></i> {/* 'X' icon for closing */}
      </button>
    </div>
  );
}

export default Notification;
