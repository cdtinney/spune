import { describe, it, expect } from 'vitest';
import uniqueAlbums, { baseAlbumName, typesWithSuffixes } from '../uniqueAlbums';
import type { SpotifyAlbum } from '../../../types';

describe('baseAlbumName()', () => {
  it('strips out suffixes in normal braces', () => {
    typesWithSuffixes.forEach((entry: string) => {
      expect(baseAlbumName(`foo (${entry})`)).toEqual('foo');
    });
  });

  it('strips out suffixes in square braces', () => {
    typesWithSuffixes.forEach((entry: string) => {
      expect(baseAlbumName(`foo [${entry}]`)).toEqual('foo');
    });
  });
});

describe('uniqueAlbums()', () => {
  it('removes all duplicates with the same base album name', () => {
    const originalAlbum = { name: 'foo' } as SpotifyAlbum;
    const duplicates = typesWithSuffixes.map(
      (entry: string) => ({ name: `foo (${entry})` }) as SpotifyAlbum,
    );

    const result = uniqueAlbums([originalAlbum, ...duplicates]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('foo');
  });
});
