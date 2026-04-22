/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                mainLight: '#11ac0a', // Add your custom main color here
                mainDark: '#11ac0a', // Add your custom main color here

                layoutBackgroundColorLight: "#d1dad8",
                layoutMainColorLight: "#748f89",

                textMainColorLight: "#2f584f",
                textSecondaryColorLight: "#d1dad8",
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
}
