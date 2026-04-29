import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { getUserType, requireUserType } from '../userType';

describe('userType', () => {
  const originalAdminIds = process.env.ADMIN_SPOTIFY_IDS;

  afterEach(() => {
    if (originalAdminIds === undefined) {
      delete process.env.ADMIN_SPOTIFY_IDS;
    } else {
      process.env.ADMIN_SPOTIFY_IDS = originalAdminIds;
    }
  });

  describe('getUserType', () => {
    it("returns 'user' when no allowlist is set", () => {
      delete process.env.ADMIN_SPOTIFY_IDS;
      expect(getUserType('anyone')).toBe('user');
    });

    it("returns 'user' when the allowlist is empty", () => {
      process.env.ADMIN_SPOTIFY_IDS = '';
      expect(getUserType('anyone')).toBe('user');
    });

    it("returns 'admin' for a Spotify ID in the allowlist", () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice,bob';
      expect(getUserType('alice')).toBe('admin');
      expect(getUserType('bob')).toBe('admin');
    });

    it("returns 'user' for a Spotify ID not in the allowlist", () => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice,bob';
      expect(getUserType('eve')).toBe('user');
    });

    it('trims whitespace and ignores empty entries', () => {
      process.env.ADMIN_SPOTIFY_IDS = ' alice , , bob ,';
      expect(getUserType('alice')).toBe('admin');
      expect(getUserType('bob')).toBe('admin');
      expect(getUserType('')).toBe('user');
    });
  });

  describe("requireUserType('admin')", () => {
    let res: Partial<Response>;
    let next: NextFunction;
    let statusMock: ReturnType<typeof vi.fn>;
    const middleware = requireUserType('admin');

    beforeEach(() => {
      process.env.ADMIN_SPOTIFY_IDS = 'alice';
      statusMock = vi.fn().mockReturnValue({ json: vi.fn() });
      res = { status: statusMock as unknown as Response['status'] };
      next = vi.fn();
    });

    function callMiddleware(user: Express.User | undefined): void {
      middleware({ user } as Request, res as Response, next);
    }

    it.each([
      { name: 'no authenticated user', user: undefined, status: 401 },
      {
        name: "an authenticated user whose userType is not 'admin'",
        user: { spotifyId: 'eve' } as Express.User,
        status: 403,
      },
    ])('responds $status when there is $name', ({ user, status }) => {
      callMiddleware(user);
      expect(statusMock).toHaveBeenCalledWith(status);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next() when the user's userType is 'admin'", () => {
      callMiddleware({ spotifyId: 'alice' } as Express.User);
      expect(statusMock).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
