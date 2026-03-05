/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        card: '#1e293b',
        'card-border': '#334155',
        muted: '#94a3b8',
        accent: '#38bdf8',
        'accent-soft': 'rgba(56,189,248,0.12)',
        'rain-low': '#60a5fa',
        'rain-med': '#f97316',
        'rain-high': '#ef4444',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
}

