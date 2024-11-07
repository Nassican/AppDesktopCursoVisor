/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        shine: "shine 2s infinite linear",
      },
    },
  },
  plugins: [],
};
