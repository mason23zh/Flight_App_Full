/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        },
    },
    darkMode: "class",
    plugins: [],
};

 
