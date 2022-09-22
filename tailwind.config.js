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
        blue: "#30C5FF",
        blue2: "#00668F",
        coral: "#FF6B7F",
        coral2: "#A80016",
        orange: "#FFBC42"
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

