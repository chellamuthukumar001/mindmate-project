/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                primary: "#8B5CF6", // Violet-500
                secondary: "#10B981", // Emerald-500
                accent: "#3B82F6", // Blue-500
                background: "#F0F9FF", // Light Blue
                surface: "#FFFFFF",
                text: "#1F2937", // Gray-800
                muted: "#9CA3AF", // Gray-400

                // Dark mode specific overrides (optional, can just use dark: classes)
                dark: {
                    background: "#0F172A",
                    surface: "#1E293B",
                    text: "#F8FAFC"
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
