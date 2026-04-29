import { describe, it, expect, afterEach } from 'vitest';
import { isLoginAllowed } from '../loginAllowlist';

describe('loginAllowlist', () => {
  const original = process.env.ALLOWED_SPOTIFY_IDS;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ALLOWED_SPOTIFY_IDS;
    } else {
      process.env.ALLOWED_SPOTIFY_IDS = original;
    }
  });

  it.each([
    { name: 'no allowlist set', allowlist: undefined, id: 'anyone', expected: true },
    { name: 'empty allowlist', allowlist: '', id: 'anyone', expected: true },
    { name: 'whitespace-only allowlist', allowlist: ' , , ', id: 'anyone', expected: true },
    { name: 'ID in allowlist', allowlist: 'alice,bob', id: 'alice', expected: true },
    { name: 'ID not in allowlist', allowlist: 'alice,bob', id: 'eve', expected: false },
    {
      name: 'allowlist with whitespace and empty entries',
      allowlist: ' alice , , bob ,',
      id: 'bob',
      expected: true,
    },
  ])('returns $expected for $name', ({ allowlist, id, expected }) => {
    if (allowlist === undefined) delete process.env.ALLOWED_SPOTIFY_IDS;
    else process.env.ALLOWED_SPOTIFY_IDS = allowlist;
    expect(isLoginAllowed(id)).toBe(expected);
  });
});
