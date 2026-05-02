module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // NeuroUX Premium Dark Theme
        'neuro-bg': '#0B0B0D',        // Deep Black - main background
        'neuro-surface': '#121214',    // Soft Black - cards / sections
        'neuro-card': '#1A1A1D',       // Charcoal - elevated surfaces
        'neuro-primary': '#E63946',    // Crimson Red - primary action
        'neuro-primary-hover': '#B02A37', // Muted Red - hover / active
        'neuro-primary-dark': '#7A1E2C',  // Deep Wine - subtle accents
        'neuro-accent': '#3A86FF',     // Electric Blue - AI feel
        'neuro-accent-alt': '#7B61FF', // Soft Purple - alternative accent
        'neuro-text-primary': '#EAEAEA',  // Primary Text
        'neuro-text-secondary': '#A1A1AA', // Secondary Text
        'neuro-text-muted': '#6B6B73',    // Muted Text
        'neuro-border': '#232326',     // Subtle Border
        'neuro-border-hover': '#2F2F33', // Hover Border
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
        slideIn: "slideIn 0.4s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(230, 57, 70, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(230, 57, 70, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
