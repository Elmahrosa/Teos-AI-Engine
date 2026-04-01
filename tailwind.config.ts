import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#0f0f1a",
        primary: "#6366f1",
      },
    },
  },
  plugins: [],
};

export default config;
