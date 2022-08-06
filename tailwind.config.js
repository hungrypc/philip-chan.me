/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const hoverPlugin = plugin(function ({ addVariant, e, postcss }) {
  addVariant('hover', ({ container, separator }) => {
    const hoverRule = postcss.atRule({ name: 'media', params: '(hover: hover)' })
    hoverRule.append(container.nodes)
    container.append(hoverRule)
    hoverRule.walkRules((rule) => {
      rule.selector = `.${e(`hover${separator}${rule.selector.slice(1)}`)}:hover`
    })
  })
})

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{jsx,tsx}',
    './components/**/*.{jsx,tsx}',
    './content/**/*.{mdx}',
    './posts/**/*.{mdx}',
    './notes/**/*.{mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        purple: '#3f3cbb',
        hovered: '#ded3c1',
        unhovered: '#e7dfd2',
        'hovered-tag': '#cadcd3',
        'unhovered-tag': '#d9e6e0',
        'hovered-dark': '#494444',
        'unhovered-dark': '#645C5C',
        'hovered-tag-dark': '#546b6a',
        'unhovered-tag-dark': '#6a8786',
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        bg: 'var(--color-background)',
        nav: 'var(--color-nav-background)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-link-posts)',
      },
      animation: {
        gradient: 'gradient 10s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 100%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 100%' },
        },
      },
      backgroundImage: {
        iridescent: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      },
      backgroundSize: {
        'zoom-350': '350% 350%',
        'zoom-150': '150% 150%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [hoverPlugin],
}
