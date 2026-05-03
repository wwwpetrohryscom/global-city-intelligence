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
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
        neutral: {
          bg: "#FFFFFF",
          soft: "#F9FAFB",
          border: "#E5E7EB",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
        },
        accent: {
          blue: "#2563EB",
          teal: "#0D9488",
        },
      },
    },
  },
};

export default config;
