/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Color primario: Carmesí Intenso / Deep Wine
          wine: '#99182A',
          'wine-dark': '#77121E',
          'wine-light': '#B3263B',
          
          // Acento suave: Rosa Blush / Soft Glam
          blush: '#F8CCD7',
          'blush-light': '#FDEDF1',
          'blush-dark': '#F0AAB9',
          
          // Neutro cálido: Seda Cálida / Nude Alabaster
          nude: '#F1DFD1',
          'nude-light': '#F8EEE7',
          'nude-dark': '#E2C8B3',
          
          // Fondo principal: Perla Rosa / Canvas Delicado
          pearl: '#FAEEEF',
          'pearl-light': '#FFFFFF',
          
          // Contraste para textos (WCAG AAA)
          text: '#2B0E14',
          'text-muted': '#6B4C53',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(248, 204, 215, 0.6)',
        'glow-wine': '0 8px 24px -6px rgba(153, 24, 42, 0.35)',
        'luxury': '0 10px 30px -10px rgba(43, 14, 20, 0.08)',
        'card': '0 4px 20px -2px rgba(153, 24, 42, 0.05)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
