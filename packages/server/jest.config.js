module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{js}',
    '!coverage/**',
  ],
  // By default, Jest runs in a JSDOM environment.
  // This has issues: https://mongoosejs.com/docs/jest.html
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    // Integration tests are run separately with
    // a different configuration.
    '/__tests__/integration/',
  ],
};
