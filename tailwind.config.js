/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
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
