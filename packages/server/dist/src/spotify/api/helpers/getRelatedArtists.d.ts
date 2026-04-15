/**
 * Get related artist names using Last.fm (primary) and ListenBrainz (fallback).
 * Returns deduplicated array of artist names.
 */
export default function getRelatedArtists(artistName: string): Promise<string[]>;
