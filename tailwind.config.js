/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)', surface: 'var(--surface)', soft: 'var(--soft)',
        ink: 'var(--ink)', muted: 'var(--muted)', line: 'var(--line)',
        accent: 'var(--accent)', 'accent-soft': 'var(--accent-soft)',
        'on-accent': 'var(--on-accent)', warning: 'var(--warning)', 'warning-soft': 'var(--warning-soft)'
      },
      fontFamily: {
        'montserrat-light' : "montserrat-light",
        'montserrat-medium' : "montserrat-medium",
        'montserrat-regular' : "montserrat-regular",
        'montserrat-bold' : "montserrat-bold",
      },
    },
  },
  plugins: [],
}
