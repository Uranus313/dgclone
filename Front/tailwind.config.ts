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
      'primary-seller': '#395F82',
      'red-box':'#A02424',
      'purple-box':'#6B1F78',
      'blue-box':'#395F82',
      'green-box':'#1F7378',
      'greener-box':'#1F7762',
      'border-color-list':'#CBCBCB'


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

  daisyui: {
    themes: [
      {
        digimarket: {
          neutral: '#717171',
          primary: "#BD1684",
          secondary: "#FF5700",
          accent: "#888888",
          "base-100": "#ffffff",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          disabled: "#717171",

        },
      },
    ],
  }
}
export default config
