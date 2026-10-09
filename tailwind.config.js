/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map all CSS custom properties to Tailwind colors
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        foam: 'var(--foam)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-2': 'var(--accent-2)',
        'panel-strong': 'var(--panel-strong)',
        'gi-icon': 'var(--gi-icon)',
        'gi-border': 'var(--gi-border)',
        'gi-edge': 'var(--gi-edge)',
        'frame-fill': 'var(--frame-fill)',
        'frame-line': 'var(--frame-line)',
      }, 
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        'title': 'var(--fs-title)',
        'h2': 'var(--fs-h2)',
        'h3': 'var(--fs-h3)',
        'h4': 'var(--fs-h4)',
        'body': 'var(--fs-body)',
        'small': 'var(--fs-small)',
        'name': 'var(--name-size)',
      },
      lineHeight: {
        'heading': 'var(--lh-heading)',
        'body': 'var(--lh-body)',
      },
      spacing: {
        'title-to-desc': 'var(--title-to-desc)',
        'title-card-to-content': 'var(--title-card-to-content)',
        'content-title-gap': 'var(--content-title-gap)',
        'page-gap': 'var(--page-gap)',
        'section-pad-y': 'var(--section-pad-y)',
      },
      blur: {
        glass: 'var(--glass-blur)',
      },
      transitionTimingFunction: {
        'out': 'var(--ease-out)',
        'soft': 'var(--ease-soft)',
        'spring': 'var(--spring)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
      boxShadow: {
        'gi': 'var(--gi-shadow)',
      },
      backgroundImage: {
        'gi-tint': 'var(--gi-tint)',
        'gi-sheen': 'var(--gi-sheen)',
        'frame-fill': 'var(--frame-fill)',
        'frame-line': 'var(--frame-line)',
      },
    },
  },
  plugins: [],
}