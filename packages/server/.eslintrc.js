module.exports = {
    env: {
        node: true,
        jest: true,
        es2022: true,
    },
    extends: 'eslint:recommended',
    globals: {
      page: true,
      browser: true,
      context: true,
      jestPuppeteer: true,
    },
    parserOptions: {
      ecmaVersion: 2022,
    },
};
