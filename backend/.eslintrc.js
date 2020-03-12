module.exports = {
  extends: [
    'airbnb-typescript-prettier',
  ],
  env: {
    jest: true
  },
  plugins: ['jest'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['**/*.test.ts', '**/*.spec.ts'] }],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  }
};