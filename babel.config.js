module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['@babel/plugin-transform-unicode-property-regex', { useUnicodeFlag: false }]
  ]
}; 