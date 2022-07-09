module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "ridge-yellow": "#e6b53f",
        "box-yellow": "#f3c86f",
        brass: "#c38e30",
        "some-slate": "#3d3d34",
        "link-blue": "#3030b1",
        "link-hover": "#31778c",
        "chan-bg": "#eef2ff",
        "chan-element": "#eeeeee",
        "chan-element-alt": "#dddddd",
        "chan-border": "#9988ee",
        "chan-red": "#990000",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
  },
  plugins: [],
};
