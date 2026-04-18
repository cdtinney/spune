import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAuthUser, getPlaybackState, getRelatedAlbums } from '../api';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

describe('spotify API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthUser', () => {
    it('returns the user from the response', async () => {
      mockedAxios.get.mockResolvedValue({ data: { user: { spotifyId: '123' } } });
      const result = await getAuthUser();
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/auth/user');
      expect(result).toEqual({ spotifyId: '123' });
    });

    it('returns null when no user in response', async () => {
      mockedAxios.get.mockResolvedValue({ data: { user: null } });
      const result = await getAuthUser();
      expect(result).toBeNull();
    });
  });

  describe('getPlaybackState', () => {
    it('calls the correct endpoint and returns data', async () => {
      const mockData = { item: { id: 'song1' } };
      mockedAxios.get.mockResolvedValue({ data: mockData });
      const result = await getPlaybackState();
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/spotify/me/player');
      expect(result).toEqual(mockData);
    });
  });

  describe('getRelatedAlbums', () => {
    it('calls the correct endpoint with songId param', async () => {
      const mockData = [{ id: 'album1' }];
      mockedAxios.get.mockResolvedValue({ data: mockData });
      const result = await getRelatedAlbums('song123');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/spotify/currently-playing/related-albums',
        {
          params: { songId: 'song123' },
        },
      );
      expect(result).toEqual(mockData);
    });
  });
});
