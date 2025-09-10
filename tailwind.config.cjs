module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand1: 'var(--brand-1)',
        brand2: 'var(--brand-2)',
        bg: '#10151c',
        panel: '#1d232a',
        glass: 'rgba(255,255,255,0.06)'
      }
    }
  },
  plugins: []
};
