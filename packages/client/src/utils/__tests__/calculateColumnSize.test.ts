import { describe, it, expect } from 'vitest';
import calculateColumnSize from '../calculateColumnSize';

describe('calculateColumnSize', () => {
  it('returns the largest size that divides evenly into the window width', () => {
    expect(calculateColumnSize({ windowWidth: 1000, minSize: 80, maxSize: 151 })).toBe(125);
  });

  it('returns minSize when no value divides evenly', () => {
    expect(calculateColumnSize({ windowWidth: 997, minSize: 80, maxSize: 151 })).toBe(80);
  });

  it('returns 0 when width is 0', () => {
    expect(calculateColumnSize({ windowWidth: 0, minSize: 80, maxSize: 151 })).toBe(0);
  });

  it('returns maxSize when it divides evenly', () => {
    expect(calculateColumnSize({ windowWidth: 151, minSize: 80, maxSize: 151 })).toBe(151);
  });
});
