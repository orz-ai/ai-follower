/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f14",
        pearl: "#f6f1ea",
        aurora: "#d7ffb8",
        haze: "#d7d6ff",
        coral: "#ffb59d",
        ocean: "#79d4ff",
        slate: "#1c2430"
      },
      boxShadow: {
        glow: "0 0 40px rgba(121, 212, 255, 0.35)",
        card: "0 20px 50px rgba(3, 8, 20, 0.2)"
      }
    }
  },
  plugins: []
};
