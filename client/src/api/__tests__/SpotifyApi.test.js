import SpotifyApi from '../SpotifyApi';

import axios from 'axios';

jest.mock('axios');

describe('SpotifyApi', () => {
  it('constructs when given no arguments', () => {
    new SpotifyApi();
  });

  describe('getMe()', ()=> {
    it('calls /api/spotify/me with options and returns successfully', (done) => {
      axios.get.mockImplementation((url, options) => {
        return Promise.resolve({
          data: 'data',
        });
      });

      const spotifyApi = new SpotifyApi();
      spotifyApi.getMe({
        foo: 'bar',
      }).then((data) => {
        expect(data).toEqual('data');
        done();
      });

      expect(axios.get).toHaveBeenCalledWith(
        '/api/spotify/me', {
          foo: 'bar',
        },
      );
    });

  });

  describe('getMyCurrentPlaybackState()', () => {
    it('calls /api/spotify/me/player with options and returns successfully', (done) => {
      axios.get.mockImplementation((url, options) => {
        return Promise.resolve({
          data: 'data',
        });
      });

      const spotifyApi = new SpotifyApi();
      spotifyApi.getMyCurrentPlaybackState({
        foo: 'bar',
      }).then((data) => {
        expect(data).toEqual('data');
        done();
      });

      expect(axios.get).toHaveBeenCalledWith(
        '/api/spotify/me/player', {
          foo: 'bar',
        },
      );
    });
  });

  describe('getCurrentlyPlayingRelatedAlbums()', () => {
    it('calls /api/spotify/currently-playing/related-albums with options and returns successfully', (done) => {
      axios.get.mockImplementation((url, options) => {
        return Promise.resolve({
          data: 'data',
        });
      });

      const spotifyApi = new SpotifyApi();
      spotifyApi.getCurrentlyPlayingRelatedAlbums('songIdFoo')
        .then((data) => {
          expect(data).toEqual('data');
          done();
        });

      expect(axios.get).toHaveBeenCalledWith(
        '/api/spotify/currently-playing/related-albums', {
          params: {
            songId: 'songIdFoo',
          },
        },
      );
    });
  });
});
