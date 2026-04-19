# Richer Album Discovery

## Goal

Make the mosaic more interesting and varied by discovering more related albums from more sources, with deeper traversal.

## Current state

- Sources: Last.fm (30 similar artists), ListenBrainz (20 similar artists)
- Traversal: 1 hop only (similar artists to the primary song artist)
- Limit: stops at 200 related albums
- Only the first song artist is used for discovery; collaborators are ignored for related artist lookup
- No genre-based discovery

## Improvements

### 1. Multi-artist discovery

Currently `getRelatedArtists` is called with only `songArtists[0]`. For tracks with multiple artists (features, collaborations), query all song artists and merge the results. This immediately widens the pool for collaborative tracks.

### 2. Spotify recommendations API

Add `GET /recommendations` as a third data source alongside Last.fm and ListenBrainz. Pass `seed_tracks` (current track) and/or `seed_artists` (track artists). This leverages Spotify's own collaborative filtering, which often surfaces different results than Last.fm's tag-based similarity.

Extract the album IDs from the recommended tracks and fetch those albums.

### 3. Deeper graph traversal (2-hop)

For the top N most-similar artists (e.g., top 5 from Last.fm), fetch _their_ similar artists too. This creates a 2-hop graph that reaches more obscure artists. Apply diminishing priority: 1-hop results appear first in the mosaic, 2-hop results fill remaining space.

Rate-limit carefully — each hop multiplies the number of external API calls.

### 4. Genre-based discovery

When the related artist pool is small (e.g., niche genres), fall back to genre-based search. Use the primary artist's genres from Spotify's artist object and search for other artists in the same genre via `GET /search?type=artist&genre=...`.

### 5. Caching improvements

- Increase `relatedArtistsCache` TTL from 1 hour to 4 hours — similar artists don't change frequently
- Add a combined "discovery result" cache keyed by song ID that caches the final merged album list, avoiding re-running the full pipeline on repeated requests for the same song

## Suggested implementation order

1. Multi-artist discovery (low effort, immediate improvement for collaborative tracks)
2. Spotify recommendations API (moderate effort, best diversity improvement)
3. Caching improvements (low effort, reduces API load for all other changes)
4. Genre-based fallback (moderate effort, helps niche genres)
5. 2-hop traversal (higher effort, biggest pool expansion but needs rate-limit care)
