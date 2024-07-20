/** @type {import('tailwindcss').Config} */
export default {
  content: ["./popup.html", "./src/popup/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        difficulty: {
          easy: "#16a34a",
          medium: "#f59e0b",
          hard: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
