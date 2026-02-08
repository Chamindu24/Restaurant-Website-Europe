/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "var(--color-gold)",
        emerald: "var(--color-emerald)",
        ivory: "var(--color-ivory)",
        charcoal: "var(--color-charcoal)",
        warmGray: "var(--color-warm-gray)",
      },
    },
  },
  plugins: [],
};
