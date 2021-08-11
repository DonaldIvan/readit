module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        70: '17.5rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
