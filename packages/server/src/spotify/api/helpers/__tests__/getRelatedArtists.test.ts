import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import getRelatedArtists from '../getRelatedArtists';

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

describe('getRelatedArtists()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
