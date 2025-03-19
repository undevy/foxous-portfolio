/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      backgroundColor: {
        page: 'var(--color-background)',
        card: 'var(--color-card)',
      },
      textColor: {
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-light)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border)',
      },
      boxShadow: {
        'theme': '0 1px 3px var(--color-shadow)',
      },
      transitionProperty: {
        'theme': 'var(--transition-theme)',
      },
    },
  },
  plugins: [],
}