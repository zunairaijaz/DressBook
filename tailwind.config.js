/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F1111', // Amazon Black
        secondary: '#F0F2F2', // Amazon Background Grey
        accent: '#FF9900', // Amazon Orange
        'accent-hover': '#E68A00',
        'amazon-blue': '#232f3e', // Amazon Nav Blue
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};