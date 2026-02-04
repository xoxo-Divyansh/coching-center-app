/** @type {import('tailwindcss').Config} */
export default { 
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
theme: {
  extend: {
    colors: {
      primary: "#7C3AED",      // purple
      surface: "#18181F",      // dark surface
      background: "#0F0F14",   // main dark bg
      muted: "#9CA3AF",        // gray text
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      heading: ["Poppins", "Inter", "sans-serif"],
    },
  },
},

  plugins: [],
}
