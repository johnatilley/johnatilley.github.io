const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    // prettier-ignore
    content: [
        "./src/views/**/*",
        "./src/js/**/*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
                heading: ["Montserrat", ...defaultTheme.fontFamily.sans],
                paragraph: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
