/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-light': '#3b82f6',
        'primary-dark': '#1d4ed8',
        secondary: '#f8fafc',
        accent: '#7c3aed',
        'accent-light': '#a78bfa',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
};
