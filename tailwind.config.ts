import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        secondary: "#95D5B2",
        safe: "#52B788",
        caution: "#F4A261",
        danger: "#E63946",
        "app-bg": "#F8F9FA",
        "app-text": "#212529",
      },
    },
  },
  plugins: [],
};
export default config;
