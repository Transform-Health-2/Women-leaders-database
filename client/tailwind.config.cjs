module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:        "#F8571D",
          "orange-light": "#F97A1A",
          orange: {
            DEFAULT: "#F8571D",
            hover:   "#d64d1f",
          },
          pink: {
            DEFAULT: "#F85A8E",
            dark:    "#e04880",
          },
          blue:          "#24588A",
          navy: {
            DEFAULT: "#02598E",
            dark:    "#024a75",
          },
          yellow:        "#FADF56",
          sand:          "#f5efe0",
          dark:          "#333333",
          cream:         "#fffff4",
          parchment:     "#f7f3ec",
          "pink-light":  "#fff0f6",
          "blue-light":  "#f0f7ff",
          "red-light":   "#fff5f5",
          "blue-bright": "#00AAFF",
          "blue-border": "#d1d9ec",
          "yellow-border": "#f0c64a",
          "parchment-border": "#d0c2b3",
          "green-border": "#bbf7d0",
          "pink-border": "#f9a8d4",
        },
        gray: {
          300: '#D9D9D9',
          500: '#666',
          600: '#444',
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          700: '#334155',
          800: '#222',
        },
        amber: {
          200: '#fde68a',
        },
        accent: {
          amber:   '#b8860b',
          purple:  '#9d174d',
          pink:    '#be185d',
        },
      },
      fontSize: {
        '1.1': '1.1rem',
        '1.2': '1.2rem',
        '1.3': '1.3rem',
        '1.4': '1.4rem',
        '1.5': '1.5rem',
        '1.6': '1.6rem',
        '2':   '2rem',
        '2.4': '2.4rem',
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
