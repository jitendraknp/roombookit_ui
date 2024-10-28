const { corePlugins, important, content } = require( './tailwind.config' );

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [ require( 'tailwindcss-primeui' ) ],
};
