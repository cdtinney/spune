import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { isAdmin, requireAdmin } from '../admin';

describe('admin', () => {
  const originalAdminIds = process.env.ADMIN_SPOTIFY_IDS;

  afterEach(() => {
    if (originalAdminIds === undefined) {
      delete process.env.ADMIN_SPOTIFY_IDS;
    } else {
      process.env.ADMIN_SPOTIFY_IDS = originalAdminIds;
    }
  });

  describe('isAdmin', () => {
    it('returns false when no allowlist is set', () => {
      delete process.env.ADMIN_SPOTIFY_IDS;
      expect(isAdmin('anyone')).toBe(false);
    });

    it('returns false when the allowlist is empty', () => {
      process.env.ADMIN_SPOTIFY_IDS = '';
      expect(isAdmin('anyone')).toBe(false);
    });

    it('returns true for a Spotify ID in the allowlist', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice,bob';
      expect(isAdmin('alice')).toBe(true);
      expect(isAdmin('bob')).toBe(true);
    });

    it('returns false for a Spotify ID not in the allowlist', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice,bob';
      expect(isAdmin('eve')).toBe(false);
    });

    it('trims whitespace and ignores empty entries', () => {
      process.env.ADMIN_SPOTIFY_IDS = ' alice , , bob ,';
      expect(isAdmin('alice')).toBe(true);
      expect(isAdmin('bob')).toBe(true);
      expect(isAdmin('')).toBe(false);
    });

    it('returns false for null or undefined Spotify IDs', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      expect(isAdmin(undefined)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe('requireAdmin', () => {
    let res: Partial<Response>;
    let next: NextFunction;
    let statusMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      statusMock = vi.fn().mockReturnValue({ json: vi.fn() });
      res = { status: statusMock as unknown as Response['status'] };
      next = vi.fn();
    });

    function callRequireAdmin(user: Express.User | undefined): void {
      requireAdmin({ user } as Request, res as Response, next);
    }

    it.each([
      { name: 'no authenticated user', user: undefined, status: 401 },
      {
        name: 'user not in the allowlist',
        user: { spotifyId: 'eve' } as Express.User,
        status: 403,
      },
    ])('responds $status when there is $name', ({ user, status }) => {
      callRequireAdmin(user);
      expect(statusMock).toHaveBeenCalledWith(status);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next() when the user is in the allowlist', () => {
      callRequireAdmin({ spotifyId: 'alice' } as Express.User);
      expect(statusMock).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
