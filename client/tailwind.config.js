/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      "primary-color": "#635FC7",
      "todo": "#49C4E5",
      "doing": "#635FC7",
      "done": "#67E2AE",
      "bg": "#FFFFFF",
      "bg-board": "#F4F7FD",
      "bg-new-task": "#ECF1FA",
      "text-primary": "#000000",
      "text-accent": "#828FA3",
      "theme-bg": "#F4F7FD",
      "bg-dark": "#2C2C38",
      "bg-board-dark": "#242430",
      "bg-new-task-dark": "#23232E",
      "text-primary-dark": "#FDFEFE",
      "text-accent-dark": "#83899B",
      "theme-bg-dark": "#21212D"
    }
  },
  plugins: [],
}