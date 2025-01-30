/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,svelte,js,ts}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
