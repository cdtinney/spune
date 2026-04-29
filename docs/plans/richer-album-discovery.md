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

### 2. Deeper graph traversal (2-hop)

For the top N most-similar artists (e.g., top 5 from Last.fm), fetch _their_ similar artists too. This creates a 2-hop graph that reaches more obscure artists. Apply diminishing priority: 1-hop results appear first in the mosaic, 2-hop results fill remaining space.

Rate-limit carefully — each hop multiplies the number of external API calls.

### 3. Genre-based discovery

When the related artist pool is small (e.g., niche genres), fall back to genre-based search. Use the primary artist's genres from Spotify's artist object and search for other artists in the same genre via `GET /search?type=artist&genre=...`.

### 4. Caching improvements

- Increase `relatedArtistsCache` TTL from 1 hour to 4 hours — similar artists don't change frequently
- Add a combined "discovery result" cache keyed by song ID that caches the final merged album list, avoiding re-running the full pipeline on repeated requests for the same song

## Rejected

### ~~Spotify recommendations API~~

`GET /recommendations` was deprecated by Spotify in November 2024 and is inaccessible to new applications. No replacement endpoint has been provided.
