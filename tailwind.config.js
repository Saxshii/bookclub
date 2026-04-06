/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#faf7f2',
        parchment: '#f5efe6',
        book: {
          50:  '#fdf8f0',
          100: '#faf0dc',
          200: '#f5deb3',
          300: '#e8c87a',
          400: '#d4a843',
          500: '#c9a96e',
          600: '#b8860b',
          700: '#8b6914',
          800: '#5c4308',
          900: '#2c1810',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Lato', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(180, 120, 40, 0.12)',
        'warm-lg': '0 8px 40px rgba(180, 120, 40, 0.2)',
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #faf7f2 0%, #f5efe6 100%)',
      }
    },
  },
  plugins: [],
}
safelist: [
  'from-indigo-200','via-purple-200','to-pink-200',
  'from-gray-300','via-slate-300','to-gray-400',
  'from-pink-200','via-rose-200','to-orange-200',
  'from-yellow-200','via-amber-200','to-orange-300'
]