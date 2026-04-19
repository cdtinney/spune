# Song History / Queue Awareness

## Goal

Make the mosaic evolve over a listening session instead of resetting entirely on each song change. Albums from recently played tracks persist and blend with the current track's related albums.

## Current behavior

When the song changes, `fetchRelatedAlbums(songId)` replaces the entire `relatedAlbums` state. The AlbumGrid cascade-flips all tiles to the new album set. The previous session's albums are lost.

## Proposed behavior

Maintain a rolling history of album pools from the last N songs. The mosaic draws from all pools, weighted toward the current song. As new songs play, the oldest pool ages out. This creates a visual "memory" of the session.

## Implementation

### 1. Album pool accumulator

Add a `albumHistory` ring buffer (e.g., last 5 songs) in SpotifyContext or a new `useAlbumHistory` hook:

```
albumHistory: [
  { songId: "current", albums: [...], weight: 1.0 },
  { songId: "previous", albums: [...], weight: 0.6 },
  { songId: "two-ago", albums: [...], weight: 0.3 },
]
```

When a new song arrives:

- Push its albums onto the history
- Drop the oldest entry if over capacity
- Merge all entries into a single `relatedAlbums` list, with duplicates removed

### 2. Weighted tile selection

When building the mosaic tile list, sample albums from the merged pool with probability proportional to their weight. Current song's albums appear more frequently; older songs' albums fill gaps and appear at the edges.

The simplest approach: repeat current-song albums 3x in the source array before shuffling. No complex probability math needed.

### 3. Smooth transitions

Instead of cascade-flipping all tiles on song change, only flip tiles that need to show new albums. Tiles already showing an album that's still in the merged pool stay put. This creates a gradual evolution rather than a jarring full reset.

### 4. Queue awareness (optional extension)

If the user has a queue, Spune could pre-fetch related albums for upcoming tracks and start blending them in before the song changes. Use `GET /me/player/queue` to peek ahead.

This is a nice-to-have — the history feature alone delivers most of the value.

## Considerations

- The album pool will grow larger (5x current size). The AlbumGrid viewport calculation already limits rendered tiles to the visible area + overscan, so performance impact should be minimal.
- Cache hits will increase since consecutive songs by the same artist reuse cached album data.
- The Chromecast receiver receives albums from the sender, so history would need to be maintained sender-side and the full merged pool sent in each Cast message.
