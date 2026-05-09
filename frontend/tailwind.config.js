/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas para o CourseSphere
        primary: "#4F46E5", // Indigo vibrante
        secondary: "#10B981", // Emerald para sucessos
        dark: "#111827", // Cinza quase preto para textos
      }
    },
  },
  plugins: [],
}