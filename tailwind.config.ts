import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        // Pure white for text and highlights
        white: {
          DEFAULT: "#FDFDFD",
          50: "#FFFFFF",
          100: "#F8F8F8",
          200: "#F0F0F0",
          300: "#E8E8E8",
          400: "#E0E0E0",
          500: "#D8D8D8",
          600: "#D0D0D0",
          700: "#C8C8C8",
          800: "#C0C0C0",
          900: "#B8B8B8",
        },
        // Deep space background - softer than pure black
        space: {
          DEFAULT: "#1A1B26", // Main background
          50: "#2A2B36",
          100: "#252631",
          200: "#20212C",
          300: "#1B1C27",
          400: "#161722",
          500: "#11121D",
          600: "#0C0D18",
          700: "#070813",
          800: "#02030E",
          900: "#000009",
        },
        // Softer blue for interactive elements
        cosmic: {
          DEFAULT: "#2B4C6D", // Main blue
          50: "#3B5C7D",
          100: "#36577A",
          200: "#315277",
          300: "#2C4D74",
          400: "#274871",
          500: "#22436E",
          600: "#1D3E6B",
          700: "#183968",
          800: "#133465",
          900: "#0E2F62",
        },
        // Muted gray for secondary elements
        lunar: {
          DEFAULT: "#B8B5B5", // Main gray
          50: "#C8C5C5",
          100: "#C3C0C0",
          200: "#BEBBBB",
          300: "#B9B6B6",
          400: "#B4B1B1",
          500: "#AFACAC",
          600: "#AAA7A7",
          700: "#A5A2A2",
          800: "#A09D9D",
          900: "#9B9898",
        },
        // Terracotta accent - softer than tomato
        terracotta: {
          DEFAULT: "#E67E5D", // Main accent
          50: "#F68E6D",
          100: "#F18968",
          200: "#EC8463",
          300: "#E77F5E",
          400: "#E27A59",
          500: "#DD7554",
          600: "#D8704F",
          700: "#D36B4A",
          800: "#CE6645",
          900: "#C96140",
        },
      },
    },
  },
  plugins: [],
};

export default config;
