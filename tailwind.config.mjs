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
          400: "#FF8A33",
          500: "#FF6B00",
          600: "#E55F00",
          navy: "#0D1B3D",
          gray: "#D7DBE0",
        },
        neutral: {
          bg: "#FFFFFF",
          soft: "#F8FAFC",
          border: "#E5E7EB",
          line: "#D7DBE0",
        },
        text: {
          primary: "#0D1B3D",
          secondary: "#475569",
          muted: "#64748B",
          inverse: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
        },
      },
    },
  },
};

export default config;
