// module.exports = {
//     plugins: {
//         "postcss-import": {},
//         tailwindcss: {},
//         autoprefixer: {},
//     },
// };

module.exports = {
    plugins: [
        require("postcss-import"),
        require("tailwindcss"),
        require("autoprefixer"),
        // require("postcss-100vh-fix"),
    ],
};
