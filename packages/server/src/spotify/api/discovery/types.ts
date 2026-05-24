import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { SpotifyAlbum, SpotifyArtist } from '../../../types';

/**
 * Snapshot of the currently playing track, passed to each discovery source.
 * Sources use this to decide which external APIs to query and which artist
 * IDs to exclude (to avoid duplicating the track artists' own albums, which
 * are always fetched separately at higher priority).
 */
export interface DiscoveryContext {
  spotifyApi: SpotifyApi;
  trackId: string;
  /** Artists credited on the song itself (may differ from album artists for features). */
  songArtists: SpotifyArtist[];
  /** Artists credited on the album (often the "main" artist on compilations). */
  albumArtists: SpotifyArtist[];
  /** Deduplicated union of song + album artist IDs, pre-computed as a Set for
   *  efficient exclusion checks across sources. */
  trackArtistIdSet: Set<string>;
}

/**
 * A pluggable album discovery strategy. Each source independently queries
 * external APIs (Last.fm, ListenBrainz, Spotify, etc.) and returns albums.
 *
 * Sources run in parallel via `runDiscovery()`. Their results are merged
 * in priority order — lower priority number means albums appear earlier
 * in the mosaic. Sources must handle their own errors and return an empty
 * array rather than throwing.
 *
 * To add a new source: implement this interface, create a file in
 * `discovery/sources/`, and add it to `DISCOVERY_SOURCES` in
 * `getCurrentlyPlayingRelatedAlbums.ts`.
 */
export interface DiscoverySource {
  name: string;
  /** Controls album ordering in the final mosaic. Lower = closer to the front.
   *  Current scale: related-artists=10, genre=20, two-hop=30. */
  priority: number;
  discover(context: DiscoveryContext): Promise<SpotifyAlbum[]>;
}
