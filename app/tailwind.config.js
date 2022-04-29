module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          200: '#2c2d30',
          300: '#35363a',
          700: '#777777',
          900: '#222222',
        },
        blue: {
          100: '#646a8b',
          500: '#4d44ce',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}