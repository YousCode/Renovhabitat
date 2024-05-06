const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1340px",
      "3xl": "1536px",
      "4xl": "1920px",
      "5xl": "2560px",
      "6xl": "3840px",
    },
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
      backgroundImage: {
        "btn-gradient": "linear-gradient(90deg, #7C3DCA 0%, #C656DB 100%)",
        "badge-gradient": "linear-gradient(180deg, #1B1B1B 0%, #000 100%)",
        "orange-pink": "linear-gradient(90deg, #eb725d 0%, #db57ad 100%)",
        welcome: "url('src/assets/welcome-2.png')",
        "welcome-gradient":
          "linear-gradient(180deg, #150C2D 0%, rgba(21, 12, 45, 0.00) 100%)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      fontSize: {
        xxs: ".625rem",
      },
      colors: {
        app: {
          DEFAULT: "#2B1C56",
          // navbar: "#0E0623",
          navbar: "#8FFF79",
          // navbar: "#67EBFF",
          // background: "#150C2D",
          // background: "#8FFF79",
          background: "#67EBFF",
          button: "#511FE0",
          accent: "#1E1438",
          "card-bg": "#39276A",
          "card-border": "#4D3A83",
          "task-bg": "#1A1234",
          "card-secondary": "#1E1438",
          light: "#AF9DE2",
          maroon: "#82054A",
        },
        details: {
          secondary: "#7665A7",
          link: "#A28FD8",
          deadline: "#E7E5BD",
          "deadline-text": "#9D8739",
        },
        tertiary: {
          DEFAULT: "#37FFDB",
          2: "#99584B",
          3: "#234275",
          4: "#26492D",
        },
        placeholder: {
          DEFAULT: "#48367C",
        },
        black: '#000',
      },
      borderColor: theme => ({
        ...theme('colors'),
        'default': theme('colors.gray.300', 'currentColor'),
        'black': '#000',
      })
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addBase, theme }) => {
      addBase({
        ".scrollbar::-webkit-scrollbar": {
          height: "5px",
          width: "2px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: theme("colors.app.background"),
        },
        ".scrollbar::-webkit-scrollbar-track-piece": {
          backgroundColor: theme("colors.purple.100"),
        },
      });
    }),
  ],
};
