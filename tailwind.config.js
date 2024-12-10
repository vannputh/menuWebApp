module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        screens: {
          'xs': '475px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
    },

  plugins: [],
}
