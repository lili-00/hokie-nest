/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#861F41', // Chicago Maroon
          hover: '#6d1934', // Slightly darker for hover states
        },
        secondary: {
          DEFAULT: '#E5751F', // Burnt Orange
          hover: '#d66a1c', // Slightly darker for hover states
        },
        neutral: {
          DEFAULT: '#75787b', // Hokie Stone
          hover: '#666969', // Slightly darker for hover states
        },
        white: '#FFFFFF', // Yardline White
      },
    },
  },
  plugins: [],
};