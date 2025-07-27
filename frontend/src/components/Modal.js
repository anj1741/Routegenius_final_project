// src/components/Modal.js
import React from 'react';

/**
 * Reusable Modal component.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} props.title - Title of the modal.
 * @param {React.ReactNode} props.children - Content to be displayed inside the modal.
 */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-card-dark rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-dark-blue-bg">
          <h3 className="text-2xl font-bold text-primary-green">{title}</h3>
          <button
            onClick={onClose}
            className="text-light-gray hover:text-red-500 transition-colors duration-300 text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body - This is where we ensure scrolling */}
        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar for styling */}
          {children}
        </div>

        {/* Modal Footer (Optional, can be added if needed, e.g., for action buttons) */}
        {/* <div className="p-4 border-t border-gray-700 bg-dark-blue-bg flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">Close</button>
          <button className="px-4 py-2 rounded-lg bg-primary-green text-dark-blue-text hover:bg-primary-green-darker">Save</button>
        </div> */}
      </div>
    </div>
  );
}

export default Modal;
