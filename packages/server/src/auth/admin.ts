import type { Request, Response, NextFunction } from 'express';

let cachedRaw: string | undefined;
let cachedSet: Set<string> = new Set();

function getAdminIds(): Set<string> {
  const raw = process.env.ADMIN_SPOTIFY_IDS;
  if (raw === cachedRaw) return cachedSet;
  cachedRaw = raw;
  cachedSet = new Set(
    (raw ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  );
  return cachedSet;
}

export function isAdmin(spotifyId: string | undefined | null): boolean {
  if (!spotifyId) return false;
  return getAdminIds().has(spotifyId);
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
