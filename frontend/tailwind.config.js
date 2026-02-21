/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1C3D5A',
        accent: '#2CB1A6',
        danger: '#E55353',
        background: '#F7FAFC',
        card: '#FFFFFF',
        textPrimary: '#1F2937',
      },
    },
  },
  plugins: [],
};
