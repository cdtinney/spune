# Task 11: Extract Publishable Packages

## Goal

Extract two pieces of spune into standalone, publishable npm packages.

## Packages

### 1. Mosaic layout library

A reusable, configurable mosaic/collage layout component for displaying images in a Zune-style tiled background. It does not need to be a separate
package, but should be easy to migrate to one later if desired.

**Features to extract:**

- The tile template system (fixed gap-free patterns)
- Multi-directional animation (drift, scroll)
- As much configuration as reasonably possible

**Current location:** `packages/client/src/hooks/useAlbumGrid.ts`, `packages/client/src/components/AlbumGrid.tsx`, `packages/client/src/components/AlbumGrid.css`

**Target:** `packages/client/libs/mosaic` in the monorepo. There

### 2. Related artists/albums discovery, e.g. "music-map"

A library that discovers related artists and their albums using different providers like Last.fm, ListenBrainz, and Spotify. It should be generic enough that it could be extended to different functionality.

It doesn't need to be a separate package yet. "music-map" is a tentative name. If you can think of something better, use that, but it needs to be
relatively generic (e.g. "related-artists" is too specific).

**Features to extract:**

- Last.fm `artist.getSimilar` integration
- ListenBrainz similar artists via MusicBrainz ID resolution
- Spotify artist search and album fetching
- Deduplication and uniqueness logic
- Configurable API keys and limits

**Current location:** `packages/server/src/spotify/api/helpers/getRelatedArtists.ts`, `getCurrentlyPlayingRelatedAlbums.ts`, `getArtistAlbums.ts`, `packages/server/src/spotify/utils/`

**Target:** `packages/server/libs/music-map/`.

## Done when

- App still works
- All checks continue to pass
- Code is clean
- Documentation is updated
