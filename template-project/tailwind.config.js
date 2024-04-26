/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#101C4E',
        'secondary': '#E2574C'
      }
    },
  },
  plugins: [],
}