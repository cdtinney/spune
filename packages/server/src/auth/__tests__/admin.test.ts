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
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let statusMock: ReturnType<typeof vi.fn>;
    let jsonMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      jsonMock = vi.fn();
      statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      res = { status: statusMock as unknown as Response['status'] };
      next = vi.fn();
    });

    it('responds 401 when there is no authenticated user', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      req = { user: undefined };
      requireAdmin(req as Request, res as Response, next);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('responds 403 when the user is not in the allowlist', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      req = { user: { spotifyId: 'eve' } as Request['user'] };
      requireAdmin(req as Request, res as Response, next);
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next() when the user is in the allowlist', () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      req = { user: { spotifyId: 'alice' } as Request['user'] };
      requireAdmin(req as Request, res as Response, next);
      expect(statusMock).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
