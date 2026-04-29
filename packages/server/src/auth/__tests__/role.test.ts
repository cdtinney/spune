import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { getRole, requireRole } from '../role';

describe('role', () => {
  const originalAdminIds = process.env.ADMIN_SPOTIFY_IDS;

  afterEach(() => {
    if (originalAdminIds === undefined) {
      delete process.env.ADMIN_SPOTIFY_IDS;
    } else {
      process.env.ADMIN_SPOTIFY_IDS = originalAdminIds;
    }
  });

  describe('getRole', () => {
    it.each([
      { name: 'no allowlist set', allowlist: undefined, id: 'anyone', expected: 'user' },
      { name: 'empty allowlist', allowlist: '', id: 'anyone', expected: 'user' },
      { name: 'ID in allowlist', allowlist: 'alice,bob', id: 'alice', expected: 'admin' },
      { name: 'ID not in allowlist', allowlist: 'alice,bob', id: 'eve', expected: 'user' },
      {
        name: 'allowlist with whitespace and empty entries',
        allowlist: ' alice , , bob ,',
        id: 'bob',
        expected: 'admin',
      },
    ])("returns '$expected' for $name", ({ allowlist, id, expected }) => {
      if (allowlist === undefined) delete process.env.ADMIN_SPOTIFY_IDS;
      else process.env.ADMIN_SPOTIFY_IDS = allowlist;
      expect(getRole(id)).toBe(expected);
    });
  });

  describe("requireRole('admin')", () => {
    let res: Partial<Response>;
    let next: NextFunction;
    let statusMock: ReturnType<typeof vi.fn>;
    const middleware = requireRole('admin');

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
        name: "an authenticated user whose role is not 'admin'",
        user: { spotifyId: 'eve' } as Express.User,
        status: 403,
      },
    ])('responds $status when there is $name', ({ user, status }) => {
      callMiddleware(user);
      expect(statusMock).toHaveBeenCalledWith(status);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next() when the user's role is 'admin'", () => {
      callMiddleware({ spotifyId: 'alice' } as Express.User);
      expect(statusMock).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
