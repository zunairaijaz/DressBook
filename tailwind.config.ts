
import type { Config } from 'tailwindcss'

// FIX: Switched from require() to import to be compatible with TypeScript's ES module system.
import aspectRatio from '@tailwindcss/aspect-ratio';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F1111', // Amazon Black
        secondary: '#F0F2F2', // Amazon Background Grey
        accent: '#FF9900', // Amazon Orange
        'accent-hover': '#E68A00',
        'amazon-blue': '#232f3e', // Amazon Nav Blue
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    aspectRatio,
  ],
}
export default config