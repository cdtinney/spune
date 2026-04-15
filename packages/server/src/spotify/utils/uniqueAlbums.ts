import type { SpotifyAlbum } from '../../types';

const types: string[] = ['Deluxe', 'Extended', 'International', 'Special', 'Standard'];

const suffixes: string[] = [
  // No suffix. Some albums are only 'Deluxe', for example.
  '',
  // These must have spaces before them to satify the regular expression.
  ' Edition',
  ' Version',
];

const typesWithSuffixes: string[] = types.reduce<string[]>(
  (acc, type) => acc.concat(suffixes.map((suffix) => `${type}${suffix}`)),
  [],
);

const joinedTypesWithSuffixes: string = typesWithSuffixes.join('|');
const openingBrace = '(\\[|\\()';
const closingBrace = '(\\]|\\))';

const suffixRegexp = new RegExp(`${openingBrace}(${joinedTypesWithSuffixes})${closingBrace}`, 'g');

// Filters out some common suffixes that results in duplicate
// album covers, such as special and deluxe edition albums.
export function baseAlbumName(albumName: string): string {
  const strippedAlbumName = albumName.replace(suffixRegexp, '');
  // Ensures all whitespace between base album name and suffix is removed.
  return strippedAlbumName.trim();
}

export default function uniqueAlbums(albums: SpotifyAlbum[]): SpotifyAlbum[] {
  // Remove duplicates by name.
  // For some reason, the API returns duplicates with different
  // IDs and image URLs.
  const uniqueMap = albums.reduce<Record<string, SpotifyAlbum>>((map, album) => {
    const name = baseAlbumName(album.name);
    if (map[name]) {
      return map;
    }

    // Immutably update the map.
    return {
      ...map,
      [name]: album,
    };
  }, {});
  return Object.values(uniqueMap);
}

export { typesWithSuffixes };
