/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#A84A32',
          hover: '#8E3B26',
          light: '#FDF4F1',
          soft: '#F5E1DA',
        },
        cream: {
          DEFAULT: '#FAF5F2',
          secondary: '#F4E8E2',
        },
        pethub: {
          border: '#E8DDD8',
          text: '#2D1E1A',
          muted: '#7A6660',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 2px 14px rgba(45, 30, 26, 0.04)',
        'clean-md': '0 6px 24px rgba(45, 30, 26, 0.07)',
        'floating': '0 10px 30px rgba(168, 74, 50, 0.18)',
      }
    },
  },
  plugins: [],
}
