module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    es6: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': ['warn'],
  },
};
