import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50:  '#F4FBE8',
          100: '#E8F7D4',
          200: '#D4F0B0',
          300: '#B8E68A',
          400: '#A8E063',
          500: '#8FCB48',
        },
        cream: {
          DEFAULT: '#FBFBF3',
          2: '#F5F4E8',
        },
        navy: {
          900: '#0A1628',
          800: '#0F1F38',
          700: '#1A2D4A',
          500: '#3B4A66',
          300: '#6B7A8F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
