/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'whatsapp-dark': "url('/whatsapp-bg-dark-large.png')",
            }
        },
    },
    plugins: [],
}