import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'nunito': ['nunito', 'sans-serif'],
      'MyFont': ['"My Font"', 'serif'], // Ensure fonts with spaces have " " surrounding it.
      'Logo': ['Karantina']
    },

    colors: {
      'primary-color': '#BD1684',
      'primary-bg': '#F4F7FF',
      'grey-border': '#E5DBE7',
      'grey-light': '#AFAFAF',
      'grey-dark': '#717171',
      'propBubble-bg': '#E5EBFA',
      'white': '#fff',
      'black': '#000',

    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
export default config
