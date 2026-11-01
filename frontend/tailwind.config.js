export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { navy: { 950: '#07121F', 900: '#0B1A2B', 800: '#12263D', 700: '#1B3453' },
      gold: { DEFAULT: '#C9A24B', light: '#E0C27A', dark: '#A8832F' }, stone: { 50: '#F6F5F2' } },
    fontFamily: { display: ['Archivo', 'sans-serif'], sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'] } } },
  plugins: [] }
