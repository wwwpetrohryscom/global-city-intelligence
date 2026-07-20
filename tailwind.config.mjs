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
        // HELPERG ecosystem accent — light blue (primary) + light green (secondary).
        eco: {
          50: "#EFF6FC",
          100: "#DEECF9",
          200: "#C7E0F4",
          400: "#2B88D8",
          500: "#0F6CBD",
          700: "#0B4C86",
        },
        ecogreen: {
          50: "#EAF6EA",
          100: "#D7EFD7",
          200: "#BBE3BB",
          500: "#4CAF50",
          700: "#2E7D32",
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
