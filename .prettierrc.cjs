module.exports = {
  tabWidth: 2,
  semi: true,
  endOfLine: 'auto',
  printWidth: 80,
  singleQuote: true,
  quoteProps: 'consistent',
  vueIndentScriptAndStyle: true,
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
  ],
};
