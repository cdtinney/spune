module.exports = {
  setupFiles: ['./jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{js}',
    '!coverage/**',
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    // Integration tests are run separately with
    // a different configuration.
    '/__tests__/integration/',
  ],
};
