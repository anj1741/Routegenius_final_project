// src/utils/helpers.js

/**
 * Formats a given date string or Date object into a readable local date and time string.
 * Optionally, can format to 'YYYY-MM-DD' for date input fields.
 *
 * @param {string | Date} dateInput - The date string (e.g., ISO 8601 from backend) or Date object.
 * @param {'default' | 'YYYY-MM-DD'} [formatType='default'] - The desired output format.
 * @returns {string} The formatted date and time string, or an empty string if input is invalid.
 */
export const formatDateTime = (dateInput, formatType = 'default') => {
  if (!dateInput) {
    return '';
  }

  try {
    const date = new Date(dateInput);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date input for formatting:', dateInput);
      return '';
    }

    if (formatType === 'YYYY-MM-DD') {
      // Format for HTML date input: YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      // Default format: local date and time string
      return date.toLocaleString();
    }
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateInput);
    return '';
  }
};
