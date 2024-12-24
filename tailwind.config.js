/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'dark': '0 4px 6px -1px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [],
}

