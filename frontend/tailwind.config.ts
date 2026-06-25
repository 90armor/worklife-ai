import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F1FB",
          100: "#B5D4F4",
          200: "#85B7EB",
          400: "#378ADD",
          600: "#185FA5",
          800: "#0C447C",
          900: "#042C53",
        },
        secondary: {
          50: "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
          900: "#04342C",
        },
        success: { 50: "#EAF3DE", 600: "#639922", 900: "#173404" },
        warning: { 50: "#FAEEDA", 600: "#BA7517", 900: "#412402" },
        error: { 50: "#FCEBEB", 400: "#E24B4A", 600: "#A32D2D", 900: "#501313" },
        info: { 50: "#E6F1FB", 600: "#378ADD", 900: "#042C53" },
        // Semantic tokens backed by CSS variables — swap automatically in dark mode
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        "neutral-border": "var(--color-border)",
        muted: "var(--color-muted)",
        body: "var(--color-body)",
        heading: "var(--color-heading)",
      },
      spacing: {
        // Sidebar dimension tokens — used for both w-* and ml-* utilities
        sidebar: "260px",
        "sidebar-rail": "60px",
      },
      borderRadius: { md: "8px", lg: "12px", pill: "999px" },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out forwards",
        slideUp: "slideUp 250ms ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
