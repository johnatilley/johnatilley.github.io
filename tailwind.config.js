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
            colors: {
                "spanish-orange": "#EB6D16",
                "charcoal": "#1F3A4C",
            },
            fontFamily: {
                montserrat: ["Montserrat", ...defaultTheme.fontFamily.sans],
                inter: ["Inter", ...defaultTheme.fontFamily.sans],
                rakkas: ["Rakkas", ...defaultTheme.fontFamily.serif],
                sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
                serif: ["Rakkas", ...defaultTheme.fontFamily.serif],
                heading: ["Montserrat", ...defaultTheme.fontFamily.sans],
                paragraph: ["Inter", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
