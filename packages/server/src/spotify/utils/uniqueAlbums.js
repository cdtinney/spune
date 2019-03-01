const types = [
  'Deluxe',
  'Extended',
  'International',
  'Special',
  'Standard',
];

const suffixes = [
  // No suffix. Some albums are only 'Deluxe', for example.
  '',
  // These must have spaces before them to satify the regular expression.
  ' Edition',
  ' Version',
];

const typesWithSuffixes = types.reduce((acc, type) => acc.concat(suffixes.map(suffix => `${type}${suffix}`)), []);

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

module.exports = function uniqueAlbums(albums) {
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
};

module.exports.typesWithSuffixes = typesWithSuffixes;
module.exports.baseAlbumName = baseAlbumName;
