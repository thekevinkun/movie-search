import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        guerrilla: ["Protest Guerrilla", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      colors: {
        main: {
          DEFAULT: "rgba(var(--text-0))",
          1: "rgba(var(--text-1))"
        },
        dark: {
          DEFAULT: "#000",
          1: "#313131"
        },
        tale: {
          DEFAULT: "rgba(var(--tale-0))",
          1: "rgba(var(--tale-1))"
        },
        danger: {
          DEFAULT: "rgba(var(--danger))",
        }
      }
    },
  },
  plugins: []
};

export default config;