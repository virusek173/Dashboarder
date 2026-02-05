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
          blue: "#3b82f6",
          DEFAULT: "#3b82f6",
        },
        secondary: {
          blue: "#60a5fa",
          DEFAULT: "#60a5fa",
        },
        tertiary: {
          blue: "#4770a1",
          DEFAULT: "#4770a1",
        },
        accent: {
          cyan: "#06b6d4",
          DEFAULT: "#06b6d4",
        },
        deep: {
          navy: "#1e3a8a",
          DEFAULT: "#1e3a8a",
        },
        bg: {
          primary: "#0f1419",
          secondary: "#1a1f2e",
          tertiary: "#252d3d",
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
