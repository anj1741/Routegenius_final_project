/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configure Tailwind to scan your React component files for classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This line tells Tailwind to look in all JS/JSX/TS/TSX files inside src/
    "./public/index.html", // Also include your main HTML file
  ],
  theme: {
    extend: {
      // Re-define your custom colors and fonts here to ensure they are available
      colors: {
        'primary-green': '#34D399',
        'primary-dark': '#0F172A',
        'card-dark': '#1E293B',
        'light-gray': '#E2E8F0',
        'medium-gray': '#CBD5E0',
        'dark-blue-text': '#1A202C',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
