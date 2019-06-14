module.exports = {
  presets: ['react-app', ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]],
  plugins: ['babel-plugin-styled-components', 'babel-plugin-array-last-index', 'babel-plugin-macros'],
};
