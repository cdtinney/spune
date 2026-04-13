const { spotifyApiWithToken } = require('../SpotifyApi');

jest.mock('@spotify/web-api-ts-sdk', () => ({
  SpotifyApi: {
    withAccessToken: jest.fn().mockReturnValue({ player: {}, artists: {} }),
  },
}));

const { SpotifyApi } = require('@spotify/web-api-ts-sdk');

describe('SpotifyApi', () => {
  describe('spotifyApiWithToken()', () => {
    it('creates a client with the given access token', () => {
      spotifyApiWithToken('foo');
      expect(SpotifyApi.withAccessToken).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ access_token: 'foo' }),
      );
    });
  });
});
