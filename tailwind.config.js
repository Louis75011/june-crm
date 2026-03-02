/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#C5A666',
        'gold-dark': '#B5956F',
        'red-crm': '#960018',
        'red-dark': '#7A0012',
        'blue-mary': '#1F3A52',
        'blue-sky': '#5B9BD5',
        'light-gray': '#F5F5F5',
        'dark-gray': '#333333',
        'border-gray': '#CCCCCC',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

