import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary-bg': "var(--primary-bg)",
        'secondary-bg': "var(--secondary-bg)",
        'tertiary-bg': "var(--tertiary-bg)",
        'border-default': "var(--border)",
        'border-hover': "var(--border-hover)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'text-tertiary': "var(--text-tertiary)",
        // TaskFixerAI Brand Colors
        brand: {
          purple: {
            light: "#A78BFA", // violet-400
            DEFAULT: "#7C3AED", // violet-600
            dark: "#5B21B6", // violet-800
          },
          cyan: {
            light: "#67E8F9", // cyan-300
            DEFAULT: "#22D3EE", // cyan-400
            dark: "#06B6D4", // cyan-500
          },
          orange: {
            light: "#FCD34D", // amber-300
            DEFAULT: "#F59E0B", // amber-500
            dark: "#D97706", // amber-600
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
