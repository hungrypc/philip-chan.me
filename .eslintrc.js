module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  plugins: ['react', 'prettier', 'tailwindcss', 'simple-import-sort', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'next/core-web-vitals',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'react/display-name': 0,
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^react$'], ['^\\u0000'], ['^\\w'], ['^@\\w'], ['^\\.']],
      },
    ],
  },
}
