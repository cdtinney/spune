module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: 'airbnb-base',
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
};
