/* eslint-disable max-len */
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const os = require('os');

const cpuCount = os.cpus().length;
let maxWorkers = '50%'; // jest default

if (cpuCount <= 2) {
  console.warn('Configuring jest with --maxWorkers=2 as otherwise tests will end in a dead-lock!');
  maxWorkers = 2;
}

module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  maxWorkers,
  testMatch: ['**/*.test.(ts|tsx|js|jsx)'],
  collectCoverageFrom: [
    'src/**/*.tsx',
    'src/**/*.ts',
  ],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts'],
  roots: [
    'src',
  ],
  testEnvironment: 'jsdom',
};
