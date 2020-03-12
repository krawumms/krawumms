module.exports = {
  rootDir: 'src',
  testMatch: ['**/*.test.(ts|tsx|js|jsx)'],
  verbose: false,
  clearMocks: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__fixtures__/',
    '/__tests__/',
    '/(__)?mock(s__)?/',
    '/__jest__/',
    '.?.min.js'
  ],
  coverageReporters: [
    'json',
  ],
  preset: '@shelf/jest-mongodb',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts']
};