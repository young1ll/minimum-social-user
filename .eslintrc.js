module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    es6: true,
    browser: true,
  },
  env: {
    jest: true,
  },
  ignorePatterns: ['node_modules/'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': ['warn'],
    'import/extensions': ['error', { js: 'never' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
