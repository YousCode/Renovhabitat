module.exports = {
  mode: "jit",
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B1C56",
          blue: "#1D4FBF",
        },
        secondary: {
          DEFAULT: "#65C466",
        },
        black: {
          100: "#272D37",
          90: "#888E95",
          80: "#9FA7B2",
          30: "#EAEBF0",
          20: "#EFF3F8",
          10: "#F8F9FB",
        },
      },
      height: {
        app: "calc(100vh - 77px)",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
