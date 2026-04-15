import { describe, it, expect } from 'vitest';
import { pool, connect, disconnect } from '../db';

describe('db', () => {
  it('exports a pool instance', () => {
    expect(pool).toBeDefined();
  });

  it('exports connect and disconnect functions', () => {
    expect(typeof connect).toBe('function');
    expect(typeof disconnect).toBe('function');
  });
});
