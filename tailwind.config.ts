import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          950: "#0F1B24",
          900: "#152531",
          800: "#1C2B39",
          700: "#25384A",
          600: "#334C63",
          500: "#4A6B85",
          400: "#7C97AC",
          300: "#AFC1CF",
        },
        amber: {
          500: "#F2A93B",
          600: "#DB9426",
          700: "#B87A1B",
        },
        paper: {
          50: "#FBF9F4",
          100: "#F7F4EE",
          200: "#EFE9DC",
        },
        rust: {
          500: "#C1502E",
          600: "#A5401F",
        },
        moss: {
          500: "#4C7A5E",
          600: "#3B6249",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        ticket: "4px",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};

export default config;
