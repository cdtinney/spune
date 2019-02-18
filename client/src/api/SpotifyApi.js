//////////////////////////
// External dependencies//
//////////////////////////

import axios from 'axios';

export default class SpotifyApi {
  _getResponseData(request) {
    return request.then(response => response.data);
  }

  getMe(options) {
    return this._getResponseData(axios.get('/api/spotify/me', options))
  }

  getMyCurrentPlaybackState(options) {
    return this._getResponseData(axios.get('/api/spotify/me/player', options));
  }

  getCurrentlyPlayingRelatedAlbums(songId) {
    return this._getResponseData(
      axios.get('/api/spotify/currently-playing/related-albums', {
        params: {
          songId,
        },
      }),
    );
  }
}
