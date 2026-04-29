function parseAllowedIds(raw: string | undefined): Set<string> | null {
  if (raw === undefined) return null;
  const ids = new Set(
    raw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );
  return ids.size === 0 ? null : ids;
}

export function isLoginAllowed(spotifyId: string): boolean {
  const allowed = parseAllowedIds(process.env.ALLOWED_SPOTIFY_IDS);
  if (allowed === null) return true;
  return allowed.has(spotifyId);
}
