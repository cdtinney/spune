import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const SPOT_CLIENT_ID: string = process.env.SPOT_CLIENT_ID || '';

export function spotifyApiWithToken(accessToken: string): SpotifyApi {
  return SpotifyApi.withAccessToken(SPOT_CLIENT_ID, {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: '',
  });
}
