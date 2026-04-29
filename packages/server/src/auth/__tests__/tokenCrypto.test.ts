import crypto from 'crypto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { encryptToken, decryptToken, _resetKeyCacheForTests } from '../tokenCrypto';

const VALID_KEY_HEX = crypto.randomBytes(32).toString('hex');

describe('tokenCrypto', () => {
  const originalKey = process.env.TOKEN_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.TOKEN_ENCRYPTION_KEY = VALID_KEY_HEX;
    _resetKeyCacheForTests();
  });

  afterEach(() => {
    process.env.TOKEN_ENCRYPTION_KEY = originalKey;
    _resetKeyCacheForTests();
  });

  it('round-trips a token through encrypt/decrypt', () => {
    const plaintext = 'BQDxyz-spotify-access-token-example';
    const encrypted = encryptToken(plaintext);
    expect(encrypted).toMatch(/^v1:/);
    expect(encrypted).not.toContain(plaintext);
    expect(decryptToken(encrypted)).toBe(plaintext);
  });

  it('produces different ciphertext for the same plaintext (random IV)', () => {
    const a = encryptToken('same-token');
    const b = encryptToken('same-token');
    expect(a).not.toBe(b);
    expect(decryptToken(a)).toBe('same-token');
    expect(decryptToken(b)).toBe('same-token');
  });

  it('fails to decrypt a value without the version prefix', () => {
    expect(() => decryptToken('plaintext-token')).toThrow(/version prefix/);
  });

  it('fails to decrypt if the ciphertext was tampered with', () => {
    const encrypted = encryptToken('a longer plaintext to ensure ciphertext bytes exist');
    // Flip a bit deep in the payload (past iv+authTag) to ensure GCM auth fails.
    const prefix = 'v1:';
    const payload = Buffer.from(encrypted.slice(prefix.length), 'base64');
    payload[payload.length - 1] ^= 0x01;
    const tampered = prefix + payload.toString('base64');
    expect(() => decryptToken(tampered)).toThrow();
  });

  it('throws a clear error if TOKEN_ENCRYPTION_KEY is not set', () => {
    delete process.env.TOKEN_ENCRYPTION_KEY;
    _resetKeyCacheForTests();
    expect(() => encryptToken('x')).toThrow(/TOKEN_ENCRYPTION_KEY is not set/);
  });

  it('throws if TOKEN_ENCRYPTION_KEY is the wrong length', () => {
    process.env.TOKEN_ENCRYPTION_KEY = 'deadbeef';
    _resetKeyCacheForTests();
    expect(() => encryptToken('x')).toThrow(/must be 32 bytes/);
  });
});
