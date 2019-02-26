module.exports = {
  coverageDirectory: 'server/coverage',
  collectCoverageFrom: [
    'server/**/*.{js}',
  ],
  // By default, Jest runs in a JSDOM environment.
  // This has issues: https://mongoosejs.com/docs/jest.html
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'client',
  ],
};
