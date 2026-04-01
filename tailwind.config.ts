import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#111827",
        line: "rgba(255,255,255,0.08)",
        brand: "#8b5cf6",
        cyan: "#22d3ee",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.2), 0 20px 80px rgba(139,92,246,0.15)",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(139,92,246,0.20), transparent 35%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        "hero-grid": "auto, 32px 32px, 32px 32px"
      }
    }
  },
  plugins: [],
};

export default config;
