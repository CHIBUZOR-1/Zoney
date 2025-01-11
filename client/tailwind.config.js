/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        facebookDark: { 
          DEFAULT: '#121212', 
          100: '#1a1a1a', 
          200: '#242424', 
          300: '#2e2e2e', 
          400: '#383838', 
          500: '#424242', 
          600: '#4c4c4c', 
          700: '#565656', 
          800: '#606060', 
          900: '#6a6a6a',
        }, 
      },
    },
  },
  plugins: [],
}

