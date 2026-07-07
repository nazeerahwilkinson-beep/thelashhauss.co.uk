import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"]
      },
      colors: {
        cream: "#fbf6f2",
        blush: "#ead7d0",
        rose: "#c89f94",
        ink: "#342724",
        gold: "#c7a15d"
      }
    }
  },
  plugins: []
};

export default config;
