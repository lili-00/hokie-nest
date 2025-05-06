/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#861F41',
          hover: '#6d1934'
        },
        secondary: {
          DEFAULT: '#E5751F',
          hover: '#d66a1c'
        },
        neutral: {
          DEFAULT: '#75787b',
          hover: '#666969'
        }
      }
    },
  },
  plugins: [],
};