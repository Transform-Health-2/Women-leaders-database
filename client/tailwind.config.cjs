module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Core palette
          orange:           "#F8571D",
          "orange-light":   "#F97A1A",
          "orange-hover":   "#d64d1f",
          pink:             "#F85A8E",
          "pink-bg":        "#FEE5F6",
          blue:             "#24588A",
          navy:             "#02598E",
          "navy-hover":     "#014a75",
          "deep-navy":      "#002D48",
          yellow:           "#FADF56",
          sand:             "#f5efe0",
          dark:             "#333333",
          cream:            "#fffff4",
          parchment:        "#f7f3ec",
          // UI tints & surfaces
          "blue-tint":      "#eef3fb",
          "dark-blue":      "#1e3a5f",
          "blue-border":    "#c8ddf3",
          "warm-border":    "#e8e0d0",
          "warm-bg":        "#faf8f3",
          "warm-row":       "#f9f7f1",
          "warm-row-border":"#f0ebe0",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        heading: "-0.042em",
      },
    },
  },
  plugins: [],
}
