'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = combineTrackArtists;
function combineTrackArtists({ songArtists, albumArtists }) {
  const artistIds = songArtists.concat(albumArtists).map((artist) => artist.id);
  // Use Set to filter for uniqueness
  return [...new Set(artistIds)];
}
//# sourceMappingURL=combineTrackArtists.js.map
