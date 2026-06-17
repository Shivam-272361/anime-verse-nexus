/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        abyss: '#050816',
        ink: '#0b1025',
        neon: {
          blue: '#41d7ff',
          purple: '#9b5cff',
          pink: '#ff4fd8',
          mint: '#6dffcf',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(65, 215, 255, 0.25)',
        pink: '0 0 36px rgba(255, 79, 216, 0.22)',
      },
      backgroundImage: {
        grid:
          'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      keyframes: {
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        borderSpin: 'borderSpin 7s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
