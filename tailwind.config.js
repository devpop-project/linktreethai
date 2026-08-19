/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          base: '#F9F9FF',
          card: '#FFFFFF',
          purple: '#A78BFA',
          mint: '#34D399',
          dark: '#1E1B4B',
        }
      }
    },
  },
  plugins: [],
}
