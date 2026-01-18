/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        fig: {
          50: '#f7f2ee',
          100: '#ede3d8',
          200: '#dbc7b0',
          300: '#c5a889',
          400: '#a9825d',
          500: '#8e6640',
          600: '#735233',
          700: '#594028',
          800: '#40301f',
          900: '#2a2015'
        }
      }
    }
  },
  plugins: []
};
