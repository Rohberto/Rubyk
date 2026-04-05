/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFAF6',
        warm:  '#F5EDE0',
        'dark-brown': '#1E1409',
        'mid-brown':  '#3D2E1E',
        muted:        '#7A6252',
        'black-bg':   '#0F0A04',
        orange: {
          DEFAULT: '#E8632A',
          light:   '#F5885A',
          pale:    '#FDF0E8',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
