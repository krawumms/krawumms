module.exports = {
  extends: [
    'airbnb-typescript-prettier',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['**/*.test.js', '**/*.spec.js'] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        'components': [
          'Link'
        ],
        'specialLink': [
          'hrefLeft',
          'hrefRight'
        ],
        'aspects': [
          'invalidHref',
          'preferButton'
        ]
      }
    ],
  }
};