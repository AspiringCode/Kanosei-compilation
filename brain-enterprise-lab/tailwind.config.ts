import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fira Code', 'monospace'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['Fira Code', 'monospace'],
      },
      colors: {
        bg:      '#020617',
        surface: '#0F172A',
        card:    '#1E293B',
        green:   '#22C55E',
        indigo:  '#6366F1',
        amber:   '#F59E0B',
        red:     '#EF4444',
        sky:     '#38BDF8',
        agent: {
          ceo:         '#D97706',
          product:     '#7C3AED',
          engineering: '#2563EB',
          hr:          '#059669',
          sales:       '#0891B2',
          marketing:   '#DB2777',
          finance:     '#EA580C',
        },
      },
      borderRadius: {
        card: '12px',
        inner: '8px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        indigo: '0 0 16px rgba(99,102,241,0.35)',
        green: '0 0 10px rgba(34,197,94,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
