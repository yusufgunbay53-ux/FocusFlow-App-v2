import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b111e",
        neon: "#00d2ff"
      },
      boxShadow: {
        neon: "0 0 24px rgba(0, 210, 255, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
