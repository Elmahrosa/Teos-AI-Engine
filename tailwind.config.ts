import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf7e3",
          100: "#f9eab6",
          200: "#f0d47e",
          300: "#E8CB7A",
          400: "#D4A83C",
          500: "#C9A84C",
          600: "#A88A30",
          700: "#8A6E22",
          800: "#6e5418",
          900: "#503c10",
        },
        teal: {
          50: "#e6faf5",
          100: "#b3f2e3",
          200: "#80e9d1",
          300: "#4de1bf",
          400: "#26d9ae",
          500: "#00bfa5",
          600: "#009988",
          700: "#007a6b",
          800: "#005c52",
          900: "#004039",
        },
        violet: {
          50: "#f5f0ff",
          100: "#e0d6ff",
          200: "#c4b0ff",
          300: "#a385ff",
          400: "#8b5cf6",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b1278",
        },
        bg: {
          DEFAULT: "#060608",
          secondary: "#0C0C14",
          surface: "#0d0d1a",
          card: "#111118",
          border: "#1a1a28",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Crimson Pro", "Playfair Display", "Georgia", "serif"],
        label: ["Space Mono", "monospace"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        "glow-teal": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 191, 165, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 191, 165, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          "0%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "slide-in": "slide-in 0.6s ease-out forwards",
        glow: "glow 3s ease-in-out infinite",
        "glow-teal": "glow-teal 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
