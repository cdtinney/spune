import type { Request, Response, NextFunction } from 'express';

function parseAdminIds(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  );
}

export function isAdmin(spotifyId: string | undefined | null): boolean {
  if (!spotifyId) return false;
  return parseAdminIds(process.env.ADMIN_SPOTIFY_IDS).has(spotifyId);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAdmin(req.user.spotifyId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
