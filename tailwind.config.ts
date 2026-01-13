import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ivory: "#F6F1E8",
        taupe: "#B8A89A",
        terracotta: "#B05A3C",
        olive: "#2F3A2E",
        charcoal: "#1F1F1F",
        gold: "#B89B5E",
        line: "rgba(31,31,31,0.12)"
      },
      borderRadius: {
        xl: "16px"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(31, 31, 31, 0.10)",
        card: "0 10px 28px rgba(31, 31, 31, 0.08)"
      },
      transitionDuration: {
        200: "200ms"
      }
    },
  },
  plugins: [],
} satisfies Config;
