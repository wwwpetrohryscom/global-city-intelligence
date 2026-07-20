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
          50: "#FFF8ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA690C",
          700: "#C7530A",
          800: "#9F4310",
          900: "#7F3811",
          navy: "#172033",
          gray: "#CBD5E1",
        },
        neutral: {
          bg: "#F7F9FC",
          soft: "#FBFCFE",
          border: "#E2E8F0",
          line: "#CBD5E1",
        },
        text: {
          primary: "#172033",
          secondary: "#526071",
          muted: "#758295",
          inverse: "#FFFFFF",
        },
        accent: {
          blue: "#268DC8",
          teal: "#22C76F",
        },
        // HELPERG ecosystem accent — light blue (primary) + light green (secondary).
        eco: {
          50: "#EFF8FF",
          100: "#DBEEFE",
          200: "#B9DEFB",
          300: "#86C7F3",
          400: "#4EABE5",
          500: "#268DC8",
          600: "#1B70A4",
          700: "#195A83",
          800: "#1A4D6D",
          900: "#193F5A",
        },
        ecogreen: {
          50: "#F0FDF6",
          100: "#DCFCE9",
          200: "#BBF7D3",
          300: "#86EFB3",
          400: "#4ADE8B",
          500: "#22C76F",
          600: "#16A45A",
          700: "#158248",
          800: "#16673D",
          900: "#145334",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#FBFCFE",
          warm: "#FFF8ED",
          page: "#F7F9FC",
          muted: "#F1F5F9",
        },
      },
    },
  },
};

export default config;
