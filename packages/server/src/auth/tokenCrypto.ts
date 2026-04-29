import crypto from 'crypto';
import logger from '../logger';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH_BYTES = 32;
const IV_LENGTH_BYTES = 12;
const AUTH_TAG_LENGTH_BYTES = 16;
export const VERSION_PREFIX = 'v1:';
const KEY_GEN_HINT = `node -e "console.log(require('crypto').randomBytes(${KEY_LENGTH_BYTES}).toString('hex'))"`;

function loadKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(`TOKEN_ENCRYPTION_KEY is not set. Generate one with: ${KEY_GEN_HINT}`);
  }
  const key = Buffer.from(raw, 'hex');
  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must be ${KEY_LENGTH_BYTES} bytes (${KEY_LENGTH_BYTES * 2} hex chars).`,
    );
  }
  return key;
}

export function verifyTokenEncryptionConfigured(): void {
  if (process.env.NODE_ENV === 'production') {
    loadKey();
    return;
  }
  if (!process.env.TOKEN_ENCRYPTION_KEY) {
    logger.warn('TOKEN_ENCRYPTION_KEY is not set; OAuth token storage will fail until configured.');
  }
}

export function encryptToken(plaintext: string): string {
  const key = loadKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, ciphertext]);
  return VERSION_PREFIX + payload.toString('base64');
}

export function decryptToken(value: string): string {
  if (!value.startsWith(VERSION_PREFIX)) {
    throw new Error('Token is not in encrypted format (missing version prefix).');
  }
  const key = loadKey();
  const payload = Buffer.from(value.slice(VERSION_PREFIX.length), 'base64');
  if (payload.length < IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES) {
    throw new Error('Encrypted token payload is too short.');
  }
  const iv = payload.subarray(0, IV_LENGTH_BYTES);
  const authTag = payload.subarray(IV_LENGTH_BYTES, IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES);
  const ciphertext = payload.subarray(IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
