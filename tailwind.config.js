const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
        tinta: "#17281F",   // texto principal: verde casi negro
        campo: "#EDF1EC",   // fondo de la app
        verde: { DEFAULT: "#1E7B4B", oscuro: "#145C38" },  // caneca verde (orgánicos)
        negra: { DEFAULT: "#2A2D31", oscuro: "#17191C" },  // caneca negra (no aprovechables)
        senal: "#F5B800",   // amarillo de señalización: progreso y foco
        alerta: "#C0392B",  // errores
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', ...fontFamily.sans],
        sans: ['"Public Sans Variable"', ...fontFamily.sans],
      },
      keyframes: {
        sacudir: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        sacudir: "sacudir 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};