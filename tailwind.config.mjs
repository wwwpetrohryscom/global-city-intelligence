const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          400: "#EA8C1A",
          500: "#D97706",
          600: "#B86108",
          700: "#92400E",
          navy: "#0F172A",
          gray: "#D7DBE0",
        },
        neutral: {
          bg: "#FFFFFF",
          soft: "#F9FAFB",
          border: "#E5E7EB",
          line: "#D7DBE0",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#64748B",
          inverse: "#FFFFFF",
        },
        accent: {
          blue: "#2563EB",
          teal: "#0D9488",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F9FAFB",
          warm: "#FFFBF7",
        },
      },
    },
  },
};

export default config;
