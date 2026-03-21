/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        teal: '#1D9E75',
        purple: '#534AB7',
        offWhite: '#F7F7F5',
        grayBorder: '#E4E4E4',
        textPrimary: '#1A1A1A',
        textMuted: '#888888',
      },
      borderRadius: {
        card: '28px',
        pill: '999px',
        small: '12px',
      },
    },
  },
  plugins: [],
}
