const { pool, connect, disconnect } = require('../db');

describe('db', () => {
  it('exports a pool instance', () => {
    expect(pool).toBeDefined();
  });

  it('exports connect and disconnect functions', () => {
    expect(typeof connect).toBe('function');
    expect(typeof disconnect).toBe('function');
  });
});
