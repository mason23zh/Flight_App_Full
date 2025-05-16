/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            height: {
                "screen-dvh": "100dvh",
            },
            zIndex: {
                "100": "100",
                "200": "200",
                "300": "300",
            },
            colors: {
                "arrival-green": "#09d654",
                "departure-red": "#fc4f4f",
            },
            fontFamily: {
                Rubik: ["Rubik", "sans-serif"],
            },
            keyframes: {
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
                messageFadeOut: {
                    //MapErrorMessageStack notification fade away effect
                    "0%": { opacity: 0.9 },
                    "100%": { opacity: 0.3 },
                },
                slideInFromLeft: {
                    "0%": {
                        opacity: 0,
                        transform: "translateX(-100%)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                    },
                },
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            },
            animation: {
                fade: "messageFadeOut 4s ease forwards",
                shimmer: "shimmer 1.5s infinite",
                bounce: "bounce 1s infinite",
                slideInFromLeft: "slideInFromLeft 0.5s ease-out",
                fadeIn: "fadeIn 0.2s ease-in",
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
        },
    },
    darkMode: "class",
    plugins: [require("tailwind-scrollbar")],
};
