import { describe, it, expect, vi } from 'vitest';
import { spotifyApiWithToken } from '../SpotifyApi';

vi.mock('@spotify/web-api-ts-sdk', () => ({
  SpotifyApi: {
    withAccessToken: vi.fn().mockReturnValue({ player: {}, artists: {} }),
  },
}));

import { SpotifyApi } from '@spotify/web-api-ts-sdk';

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
