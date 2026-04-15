import { describe, it, expect, afterEach } from 'vitest';
import {
  relatedArtistsCache,
  artistIdCache,
  artistAlbumsCache,
  normalizeKey,
  NOT_FOUND,
} from '../index';

describe('cache module', () => {
  afterEach(() => {
    relatedArtistsCache.clear();
    artistIdCache.clear();
    artistAlbumsCache.clear();
  });

  describe('normalizeKey()', () => {
    it('lowercases and trims the input', () => {
      expect(normalizeKey('  Foo Bar  ')).toBe('foo bar');
    });
  });

  describe('relatedArtistsCache', () => {
    it('stores and retrieves values', () => {
      relatedArtistsCache.set('key', ['Artist A']);
      expect(relatedArtistsCache.get('key')).toEqual(['Artist A']);
    });

    it('returns undefined for missing keys', () => {
      expect(relatedArtistsCache.get('missing')).toBeUndefined();
    });
  });

  describe('artistIdCache', () => {
    it('stores and retrieves string values', () => {
      artistIdCache.set('known', 'spotify-id-123');
      expect(artistIdCache.get('known')).toBe('spotify-id-123');
    });

    it('stores NOT_FOUND sentinel for unresolved artists', () => {
      artistIdCache.set('unknown', NOT_FOUND);
      expect(artistIdCache.get('unknown')).toBe(NOT_FOUND);
    });
  });

  describe('artistAlbumsCache', () => {
    it('stores and retrieves album results', () => {
      const result = {
        artistId: 'abc',
        albums: [{ name: 'Album 1' }],
      };
      artistAlbumsCache.set('abc', result as any);
      expect(artistAlbumsCache.get('abc')).toEqual(result);
    });
  });
});
