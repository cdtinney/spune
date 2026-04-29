import { vi } from 'vitest';
import type { DiscoveryContext } from '../../types';

export const mockSpotifyApi = {
  search: vi.fn(),
  artists: { get: vi.fn() },
};

export function makeContext(overrides: Partial<DiscoveryContext> = {}): DiscoveryContext {
  return {
    spotifyApi: mockSpotifyApi as any,
    trackId: 'track1',
    songArtists: [{ id: 'a1', name: 'Artist One' }],
    albumArtists: [{ id: 'a1', name: 'Artist One' }],
    trackArtistIdSet: new Set(['a1']),
    ...overrides,
  };
}
