'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = getArtistAlbums;
const uniqueAlbums_1 = __importDefault(require('../../utils/uniqueAlbums'));
async function getArtistAlbums(spotifyApi, artistId) {
  const data = await spotifyApi.artists.albums(artistId, 'album,compilation', undefined, 50);
  return {
    artistId,
    albums: (0, uniqueAlbums_1.default)(data.items),
  };
}
//# sourceMappingURL=getArtistAlbums.js.map
