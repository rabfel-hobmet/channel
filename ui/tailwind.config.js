module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "offwhite": "#eeeeee",
        "ridge-yellow": "#e6b53f",
        "box-yellow": "#f3c86f",
        "link-blue": "#3030b1",
        "brass": "#c38e30",
        "some-slate": "#3d3d34",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
  },
  plugins: [],
};
