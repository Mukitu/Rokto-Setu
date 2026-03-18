/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#C0001A',
          dark: '#8B0000',
          light: '#FF3355',
        },
        bg: '#FFF8F0',
        text: '#1A0A0A',
        grey: '#6B7280',
        green: '#0A7A40',
        orange: '#D97706',
      },
    },
  },
  plugins: [],
}
