# Task 11: Extract Publishable Packages

## Goal

Extract two pieces of spune into standalone, publishable npm packages.

## Packages

### 1. Mosaic layout library (`@spune/mosaic` or similar)

A reusable mosaic/collage layout component for displaying images in a Zune-style tiled background.

**Features to extract:**
- The tile template system (fixed gap-free patterns)
- Multi-directional animation (drift, scroll)
- Configurable base unit, template patterns, and animation speeds
- Framework-agnostic core with a React wrapper

**Current location:** `packages/client/src/hooks/useAlbumGrid.ts`, `packages/client/src/components/AlbumGrid.tsx`, `packages/client/src/components/AlbumGrid.css`

**Target:** `packages/mosaic/` in the monorepo, publishable to npm.

### 2. Related artists discovery (`@spune/related-artists` or similar)

A module that discovers related artists and their albums using Last.fm, ListenBrainz, and Spotify.

**Features to extract:**
- Last.fm `artist.getSimilar` integration
- ListenBrainz similar artists via MusicBrainz ID resolution
- Spotify artist search and album fetching
- Deduplication and uniqueness logic
- Configurable API keys and limits

**Current location:** `packages/server/src/spotify/api/helpers/getRelatedArtists.ts`, `getCurrentlyPlayingRelatedAlbums.ts`, `getArtistAlbums.ts`, `packages/server/src/spotify/utils/`

**Target:** `packages/related-artists/` in the monorepo, publishable to npm.

## Done when

- Both packages have their own `package.json`, `tsconfig.json`, and tests.
- Both are importable from the main app via workspace references.
- Both have README docs with usage examples.
- Publishing to npm is possible (but not required for this task).
