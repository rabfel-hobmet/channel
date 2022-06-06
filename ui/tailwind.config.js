module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "ridge-yellow": "#e6b53f",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
  },
  plugins: [],
};
