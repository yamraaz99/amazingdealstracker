import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          yellow: '#FFE135',
          gold: '#FFB800',
          orange: '#FF9900',
          orangeDark: '#FF7F00',
        },
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'dots-pattern': 'radial-gradient(#FFB800 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
