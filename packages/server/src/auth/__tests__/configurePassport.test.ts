import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import configurePassport from '../configurePassport';

describe('configurePassport', () => {
  beforeEach(() => {
    // Required for Spotify passport strategy.
    process.env = Object.assign(process.env, {
      SPOT_CLIENT_ID: 'fooClientId',
      SPOT_CLIENT_SECRET: 'fooClientSecret',
      SPOT_REDIRECT_URI: 'fooRedirectUri',
    });
  });

  const mockPassport = {
    serializeUser: vi.fn(),
    deserializeUser: vi.fn(),
    use: vi.fn(),
  };

  it('sets serializeUser', () => {
    configurePassport(mockPassport);
    expect(mockPassport.serializeUser).toHaveBeenCalled();
  });

  it('sets deserializeUser', () => {
    configurePassport(mockPassport);
    expect(mockPassport.deserializeUser).toHaveBeenCalled();
  });

  it('adds a spotify passport strategy', () => {
    configurePassport(mockPassport);
    expect(mockPassport.use.mock.calls[0][0]).toBeInstanceOf(SpotifyStrategy);
  });
});
