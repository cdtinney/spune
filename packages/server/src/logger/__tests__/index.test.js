const logger = require('../');

describe('logger', () => {
  it('exports a defined object', () => {
    expect(logger).toBeDefined();
  });

  it('has an info() method', () => {
    expect(logger.info).toBeInstanceOf(Function);
  });

  it('has an error() method', () => {
    expect(logger.info).toBeInstanceOf(Function);
  });
});
