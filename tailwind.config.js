/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
        '18': '4.5rem',
      },
      colors: {
        accent: 'var(--dt-accent)',
        'accent-soft': 'var(--dt-accent-soft)',
        surface: 'var(--dt-surface)',
        'surface-raised': 'var(--dt-surface-raised)',
        'surface-overlay': 'var(--dt-surface-overlay)',
        border: 'var(--dt-border)',
        'text-primary': 'var(--dt-text-primary)',
        'text-secondary': 'var(--dt-text-secondary)',
        'text-muted': 'var(--dt-text-muted)',
      },
      fontFamily: {
        ui: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.2s ease-out both',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        native: 'var(--dt-radius)',
        'native-sm': 'var(--dt-radius-sm)',
        'native-lg': 'var(--dt-radius-lg)',
      },
      boxShadow: {
        glow: '0 0 0 3px var(--dt-accent-soft)',
        'glow-sm': '0 0 0 2px var(--dt-accent-soft)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
