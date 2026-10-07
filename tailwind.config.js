/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        magenta: {
          400: '#F0559F',
          500: '#EC2E8E',
          600: '#D6229B',
        },
        logoblue: '#2563EB',
        ink: {
          DEFAULT: '#12102B',
          soft: '#1B1740',
          light: '#2A2458',
        },
        mist: '#F7F7FC',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,16,43,.04), 0 8px 24px rgba(18,16,43,.06)',
        cardhover: '0 4px 8px rgba(18,16,43,.06), 0 18px 40px rgba(18,16,43,.12)',
        pop: '0 24px 60px rgba(18,16,43,.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #7C3AED 0%, #C026D3 100%)',
        'hero-gradient': 'linear-gradient(135deg, #F5F3FF 0%, #FFF7FD 55%, #F2F5FF 100%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'none' } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(.97)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .4s ease-out both',
        'scale-in': 'scale-in .2s ease-out both',
      },
    },
  },
  plugins: [],
}
