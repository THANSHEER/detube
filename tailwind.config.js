/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand accent — DeTube indigo, used for active states
        accent: 'var(--dt-accent)',
        'accent-soft': 'var(--dt-accent-soft)',
        // Browser-native surface tokens
        surface: 'var(--dt-surface)',
        'surface-raised': 'var(--dt-surface-raised)',
        'surface-overlay': 'var(--dt-surface-overlay)',
        border: 'var(--dt-border)',
        'text-primary': 'var(--dt-text-primary)',
        'text-secondary': 'var(--dt-text-secondary)',
        'text-muted': 'var(--dt-text-muted)',
        // Legacy aliases
        brand: {
          main: 'var(--dt-accent)',
          dark: 'var(--dt-surface)',
        },
      },
      fontFamily: {
        // System-native font stack — matches each browser's OS font
        ui: ['var(--dt-font)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      borderRadius: {
        'native': 'var(--dt-radius)',
        'native-sm': 'var(--dt-radius-sm)',
        'native-lg': 'var(--dt-radius-lg)',
      },
    },
  },
  plugins: [],
}
