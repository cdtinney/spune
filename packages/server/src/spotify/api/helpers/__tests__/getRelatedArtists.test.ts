import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import getRelatedArtists from '../getRelatedArtists';
import { relatedArtistsCache } from '../../../../cache';

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

describe('getRelatedArtists()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    relatedArtistsCache.clear();
    process.env.LAST_FM_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.LAST_FM_API_KEY;
  });

  it('returns artist names from Last.fm and ListenBrainz combined', async () => {
    // Last.fm response
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('audioscrobbler')) {
        return Promise.resolve({
          data: {
            similarartists: {
              artist: [{ name: 'Artist A' }, { name: 'Artist B' }],
            },
          },
        });
      }
      if (url.includes('musicbrainz')) {
        return Promise.resolve({
          data: { artists: [{ id: 'mbid-123' }] },
        });
      }
      if (url.includes('listenbrainz')) {
        return Promise.resolve({
          data: {
            payload: {
              jspf: {
                playlist: {
                  track: [{ creator: 'Artist B' }, { creator: 'Artist C' }],
                },
              },
            },
          },
        });
      }
      return Promise.reject(new Error('unexpected URL'));
    });

    const names = await getRelatedArtists('Test Artist');
    expect(names).toContain('Artist A');
    expect(names).toContain('Artist B');
    expect(names).toContain('Artist C');
    // Deduplicated — Artist B appears in both but only once
    expect(names.filter((n: string) => n === 'Artist B')).toHaveLength(1);
  });

  it('returns empty array when LAST_FM_API_KEY is not set and ListenBrainz fails', async () => {
    delete process.env.LAST_FM_API_KEY;
    mockedAxios.get.mockRejectedValue(new Error('network error'));

    const names = await getRelatedArtists('Test Artist');
    expect(names).toEqual([]);
  });

  it('returns cached results on subsequent calls without additional API calls', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('audioscrobbler')) {
        return Promise.resolve({
          data: { similarartists: { artist: [{ name: 'Cached Artist' }] } },
        });
      }
      if (url.includes('musicbrainz')) {
        return Promise.resolve({ data: { artists: [{ id: 'mbid-1' }] } });
      }
      if (url.includes('listenbrainz')) {
        return Promise.resolve({
          data: { payload: { jspf: { playlist: { track: [] } } } },
        });
      }
      return Promise.reject(new Error('unexpected URL'));
    });

    const first = await getRelatedArtists('Cache Test');
    const callCount = mockedAxios.get.mock.calls.length;

    const second = await getRelatedArtists('Cache Test');
    expect(second).toEqual(first);
    expect(mockedAxios.get.mock.calls.length).toBe(callCount);
  });
});
