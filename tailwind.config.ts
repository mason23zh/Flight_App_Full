import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Rubik: ["Rubik", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        bounce: "bounce 1s infinite",
      },
      screens: {
        airportAccordionExSm: "530px",
        sm: "576px",
        // => @media (min-width: 576px) { ... }

        airportAccordionSm: "800px",
        md: "960px",
        // => @media (min-width: 960px) { ... }

        tableShrinkAgain: "990px",
        airportAccordionMd: "1100px",
        ExWeatherHeadMd: "1200px",
        tableShrink: "1280px",
        lg: "1440px",
        // => @media (min-width: 1440px) { ... }
        xl: "1775px",
        fs: "1960px",
        airportAccordionSmMax: { max: "800px" },
        lgMd: { max: "960px" },
      },
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
    },
  },
  darkMode: "class",
  plugins: [],
}
export default config
