import type { Request, Response, NextFunction, RequestHandler } from 'express';

export type Role = 'admin' | 'user';

function parseAdminIds(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export function getRole(spotifyId: string): Role {
  return parseAdminIds(process.env.ADMIN_SPOTIFY_IDS).has(spotifyId) ? 'admin' : 'user';
}

export function requireRole(role: Role): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (getRole(req.user.spotifyId) !== role) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
