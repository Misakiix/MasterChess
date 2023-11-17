import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#_masterchess',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'home-image': 'url(/chess_hero.jpg)',
      },
      backgroundColor: {
        'masterchess': '#383635',
        'masterchess-dark': '#2a2a2a',
        'masterchess-btns': '#b58863',
        'masterchess-hover-btns': '#c5a286'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true
  },
}
export default config
