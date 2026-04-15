'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.typesWithSuffixes = void 0;
exports.baseAlbumName = baseAlbumName;
exports.default = uniqueAlbums;
const types = ['Deluxe', 'Extended', 'International', 'Special', 'Standard'];
const suffixes = [
  // No suffix. Some albums are only 'Deluxe', for example.
  '',
  // These must have spaces before them to satify the regular expression.
  ' Edition',
  ' Version',
];
const typesWithSuffixes = types.reduce(
  (acc, type) => acc.concat(suffixes.map((suffix) => `${type}${suffix}`)),
  [],
);
exports.typesWithSuffixes = typesWithSuffixes;
const joinedTypesWithSuffixes = typesWithSuffixes.join('|');
const openingBrace = '(\\[|\\()';
const closingBrace = '(\\]|\\))';
const suffixRegexp = new RegExp(`${openingBrace}(${joinedTypesWithSuffixes})${closingBrace}`, 'g');
// Filters out some common suffixes that results in duplicate
// album covers, such as special and deluxe edition albums.
function baseAlbumName(albumName) {
  const strippedAlbumName = albumName.replace(suffixRegexp, '');
  // Ensures all whitespace between base album name and suffix is removed.
  return strippedAlbumName.trim();
}
function uniqueAlbums(albums) {
  // Remove duplicates by name.
  // For some reason, the API returns duplicates with different
  // IDs and image URLs.
  const uniqueMap = albums.reduce((map, album) => {
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
//# sourceMappingURL=uniqueAlbums.js.map
