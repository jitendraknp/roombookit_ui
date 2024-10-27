const { corePlugins, important } = require( './tailwind.config' );

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,ts}' ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [ require( 'tailwindcss-primeui' ) ],
};
