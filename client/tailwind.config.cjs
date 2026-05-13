/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      colors: {
        bg: "#121212",
        surface: "#1F1F1F",
        card: "#2A2A2A",
        primaryText: "#FFFFFF",
        secondaryText: "#9E9E9E",
        gold: "#D4AF37",
        goldLight: "#FFD15C",
        teal: "#65C3BA"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(212,175,55,0.25), 0 30px 80px rgba(0,0,0,0.6)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 48px rgba(0,0,0,0.5)"
      }
    }
  },
  plugins: []
};