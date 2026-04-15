# Spune Client

React 19 + Vite + TypeScript single-page application.

## Architecture

```
src/
  api/          # Spotify API client
  cast/         # Chromecast sender and receiver
  components/   # UI components (AlbumGrid, SongCard, CoverOverlay, etc.)
  contexts/     # React contexts (UserContext, SpotifyContext)
  hooks/        # Custom hooks (polling, SSE, window size, album grid)
  pages/        # Page components (Home, Visualization, Error)
  types/        # TypeScript type definitions
```

## Key features

- **Mosaic grid**: Zune-style tile template with 3 sizes (1x1, 2x2, 3x3), diagonal drift animation, and periodic tile flips
- **Color extraction**: Dominant color from album art drives the overlay tint
- **SSE + polling**: Server-Sent Events for playback updates, with polling fallback
- **Chromecast**: Cast sender SDK integration with a standalone receiver app

## Configuration

Create `.env` in this directory for client-specific settings:

```bash
VITE_CAST_APP_ID=your-cast-app-id  # Optional: Chromecast app ID
```

## Scripts

```bash
pnpm dev        # Start Vite dev server (port 3000)
pnpm build      # Build to build/
pnpm test       # Run tests (Vitest)
pnpm lint       # Lint (ESLint)
```

## Tests

Tests use Vitest + React Testing Library. Run with `pnpm test`.
