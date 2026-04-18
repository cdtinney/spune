import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAuthUser } from '../api';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

describe('auth API', () => {
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
});
