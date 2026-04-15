# Task 9: API Response Caching

## Goal

Add caching to reduce external API calls and improve response times.

## Context

Every related-albums request currently makes:
- 1 Spotify API call (currently playing track)
- 1 Last.fm API call (similar artists)
- 2 MusicBrainz + ListenBrainz API calls (similar artists)
- N Spotify search calls (resolve artist names to IDs)
- N Spotify artist album calls

With 3-second polling, this generates significant API traffic for data that rarely changes.

## What to do

### Server-side caching
- Add an in-memory cache (e.g., `node-cache` or a simple Map with TTL) for:
  - **Related artists by artist name** (TTL: 1 hour) — Last.fm/ListenBrainz results don't change often.
  - **Artist albums by artist ID** (TTL: 30 minutes) — album catalogs change rarely.
  - **Spotify artist ID by name** (TTL: 1 hour) — name-to-ID mappings are stable.
- The currently-playing endpoint should NOT be cached (it needs to be real-time).
- Consider Redis for shared caching if scaling to multiple instances.

### Client-side caching
- Don't re-fetch related albums if the album ID hasn't changed (already partially done via `currentAlbumIdRef`).
- Consider `stale-while-revalidate` for the album grid — show old albums while fetching new ones on song change.

## Done when

- External API calls are reduced by 80%+ during continuous playback of the same artist.
- Related albums response time improves noticeably.
- Cache is invalidated properly when the artist changes.
