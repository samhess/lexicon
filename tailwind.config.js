/** @type {import('tailwindcss').Config} */

const round = (num) => num.toFixed(7).replace(/(\.[0-9]+?)0+$/, '$1').replace(/\.0$/, '')
const em = (px, base) => `${round(px / base)}em`
const rem = (px) => `${round(px / 16)}rem`

export default {
  content: ['./src/**/*.svelte'],
  theme: {
    extend: {
      colors: ({ colors }) => ({
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
            table: {
              borderSpacing: 0,
              borderCollapse: 'collapse',
              captionSide: 'bottom',
              tableLayout: 'auto',
              textAlign: 'left',
              display: 'flex',
              marginTop: em(32, 16),
              marginBottom: em(32, 16),
              width: '100%',
            },
            td: {
              paddingTop: em(6, 16),
              paddingBottom: em(6, 16),
            },
            figcaption: {
              fontSize: 'larger',
              textAlign: 'center',
            },
            caption: {
              marginTop: em(16, 16),
              fontSize: 'larger',
              textAlign: 'center',
            }
          },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("@tailwindcss/forms")({
      strategy: 'base', // only generate global styles
    }),
  ]
}
