/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#f4c025",
                "primary-dark": "#dca60b",
                "navy": "#0f172a",
                "navy-light": "#1e293b",
                "background-light": "#f8f8f5",
                "background-dark": "#221e10",
                "surface-dark": "#112240",
                "gold": "#ffd900",
                "whatsapp": "#25D366"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            }
        },
    },
    plugins: [],
}
