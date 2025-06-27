/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'brutalist': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'neo-black': '#000000',
        'neo-white': '#ffffff',
        'neo-gray': '#f3f4f6',
        'neo-dark': '#1f2937',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'neo-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
} 