/** @type {import('tailwindcss').Config} */
module.exports = {
  // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
  blocklist: ["overline"],
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        steel: 'rgb(var(--steel) / <alpha-value>)',
      },
      boxShadow: {
        pixel: '6px 6px 0 0 rgb(var(--ink))',
        'pixel-sm': '4px 4px 0 0 rgb(var(--ink))',
        'pixel-muted': '4px 4px 0 0 rgb(var(--steel))',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
