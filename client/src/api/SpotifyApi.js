//////////////////////////
// External dependencies//
//////////////////////////

import Spotify from 'spotify-web-api-js';
import axios from 'axios';

export default class SpotifyApi {
  constructor() {
    this._originalApi = new Spotify();
  }

  get originalApi() {
    return this._originalApi;
  }

  getCurrentlyPlayingRelatedAlbums() {
    return axios.get('/api/currently-playing/related-albums');
  }
}
