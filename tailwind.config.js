/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                dark: "0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -2px rgba(255, 255, 255, 0.3)",
                darklg: "0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -4px rgba(255, 255, 255, 0.3)",
            },
            keyframes: {
                fadeIn: {
                    "0%": {
                        opacity: "0",
                        transform: "scale(.98) translateY(4px)",
                    },
                    "100%": { opacity: "1", transform: "none" },
                },
            },
            animation: {
                fadeIn: "fadeIn 120ms ease-out both",
            },
        },
    },
    plugins: [],
};
