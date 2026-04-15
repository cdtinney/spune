import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAuthUser, getPlaybackState, getRelatedAlbums } from '../spotify';

vi.mock('axios');

describe('spotify API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthUser', () => {
    it('returns the user from the response', async () => {
      axios.get.mockResolvedValue({ data: { user: { spotifyId: '123' } } });
      const result = await getAuthUser();
      expect(axios.get).toHaveBeenCalledWith('/api/auth/user');
      expect(result).toEqual({ spotifyId: '123' });
    });

    it('returns null when no user in response', async () => {
      axios.get.mockResolvedValue({ data: { user: null } });
      const result = await getAuthUser();
      expect(result).toBeNull();
    });
  });

  describe('getPlaybackState', () => {
    it('calls the correct endpoint and returns data', async () => {
      const mockData = { item: { id: 'song1' } };
      axios.get.mockResolvedValue({ data: mockData });
      const result = await getPlaybackState();
      expect(axios.get).toHaveBeenCalledWith('/api/spotify/me/player');
      expect(result).toEqual(mockData);
    });
  });

  describe('getRelatedAlbums', () => {
    it('calls the correct endpoint with songId param', async () => {
      const mockData = [{ id: 'album1' }];
      axios.get.mockResolvedValue({ data: mockData });
      const result = await getRelatedAlbums('song123');
      expect(axios.get).toHaveBeenCalledWith('/api/spotify/currently-playing/related-albums', {
        params: { songId: 'song123' },
      });
      expect(result).toEqual(mockData);
    });
  });
});
