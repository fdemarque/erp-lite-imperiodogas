/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#edf4ef',
          100: '#daeade',
          200: '#bad6c1',
          300: '#94bfa0',
          400: '#69a67a',
          500: '#2c5f34',
          600: '#2c5f34',
          700: '#214727',
          800: '#17311b',
          900: '#0c1a0e',
        }
      }
    },
  },
  plugins: [],
}