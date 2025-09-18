// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glamCream: "#f3e7cd",
        glamCreamDark: "#e9d29e",
        glamDarkBrown: "#39392e",
        glamGold: "#c8ac5f",
        glamWhite: "#FFFCF3",
      },
      fontFamily: {
        cormorant: ['Cormorant', 'serif'],
        satisfy: ['Satisfy', 'cursive'],
      },
      fontWeight: {
        'satisfy-bold': '700',
        'satisfy-normal': '400',
      },
    },
  },
  plugins: [],
}