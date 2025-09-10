module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for user chosen brand colours.
        brand1: 'var(--brand-1)',
        brand2: 'var(--brand-2)',
        bg: '#10151c',
        panel: '#1d232a',
        glass: 'rgba(255, 255, 255, 0.05)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
};