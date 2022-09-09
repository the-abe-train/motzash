/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        header: ['Acme', 'sans-serif'],
      },
      colors: {
        yellow1: '#FFFF66',   // Baby Powder
        yellow2: "#FCFCCF",
        ghost: '#F8F4F9',
        blue1: "#30C5FF",
        coral: "rgba(255, 107, 127, 1)"
      },
      dropShadow: {
        'big': "12px 12px 0px #000000",
        'small': "6px 6px 0px #000000",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

