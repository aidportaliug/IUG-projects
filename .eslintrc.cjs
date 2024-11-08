module.exports = {
  extends: [
    'react-app',
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // must be placed last
  ],
  plugins: ['prettier', 'react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error'],
  },
};
