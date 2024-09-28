/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.svelte'],
  theme: {
    extend: {
      colors: ({colors}) => ({
        primary: colors.sky,
        secondary: colors.slate,
        success: colors.green,
        warning: colors.yellow,
        danger: colors.red,
        info: colors.cyan
      }),
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            td: {
              paddingTop: 2,
              paddingBottom: 2,
            },
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("@tailwindcss/forms")({strategy:'base'}),
  ]
}
