/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:    { DEFAULT: '#08080f', 2: '#0f0f1c', 3: '#161625', 4: '#1e1e30', 5: '#2a2a3f' },
        cyan:   { DEFAULT: '#00d4ff', dim: '#0099bb', glow: 'rgba(0,212,255,0.15)' },
        rose:   { DEFAULT: '#ff4466', dim: '#cc2244' },
        amber:  { DEFAULT: '#ffb830' },
        slate:  { text: '#c8c8e0', muted: '#7070a0', faint: '#363650' },
      },
      fontFamily: {
        display: ['"Oxanium"', 'monospace'],
        ui:      ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'cyan':    '0 0 20px rgba(0,212,255,0.3)',
        'cyan-sm': '0 0 10px rgba(0,212,255,0.2)',
        'rose':    '0 0 20px rgba(255,68,102,0.35)',
        'card':    '0 8px 32px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'cyan-grad':  'linear-gradient(135deg, #00d4ff 0%, #0099bb 100%)',
        'rose-grad':  'linear-gradient(135deg, #ff4466 0%, #cc2244 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease both',
        'fade-in':    'fadeIn 0.3s ease both',
        'shimmer':    'shimmer 1.6s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-x':    'slideX 0.35s ease both',
      },
      keyframes: {
        fadeUp:  { from: { opacity:'0', transform:'translateY(16px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        slideX:  { from: { opacity:'0', transform:'translateX(-12px)' }, to: { opacity:'1', transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
