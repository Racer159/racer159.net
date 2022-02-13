module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      'html',
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    env: {
        browser: true,
        node: true
    }
  };
