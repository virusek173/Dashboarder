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
        primary: {
          blue: "rgb(0, 138, 255)",
          DEFAULT: "rgb(0, 138, 255)",
        },
        secondary: {
          blue: "rgb(50, 121, 181)",
          DEFAULT: "rgb(50, 121, 181)",
        },
        tertiary: {
          blue: "rgb(54, 87, 115)",
          DEFAULT: "rgb(54, 87, 115)",
        },
        accent: {
          cyan: "#0098db",
          DEFAULT: "#0098db",
        },
        deep: {
          navy: "#002664",
          DEFAULT: "#002664",
        },
        bg: {
          primary: "#1a1f2e",
          secondary: "#232938",
          tertiary: "#2d3548",
        },
        text: {
          primary: "#f9fafb",
          secondary: "#d1d5db",
          muted: "#9ca3af",
        },
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
export default config;
