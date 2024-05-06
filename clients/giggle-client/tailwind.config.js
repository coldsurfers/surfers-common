/** @type {import('tailwindcss').Config} */
module.exports = {
  // purge: [],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  },
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
