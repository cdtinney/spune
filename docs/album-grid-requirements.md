# Album Grid UI Requirements

## Layout

The album grid is a full-viewport background mosaic of album artwork displayed behind a semi-transparent color overlay. It is the primary visual element of the visualization page.

### Tile Sizes

Albums are displayed at **5 different sizes** based on a base grid unit. The sizes create visual hierarchy and variety:

| Size   | Grid Span | Approx Pixels (at 80px base) |
|--------|-----------|------------------------------|
| XS     | 1x1       | 80x80                        |
| S      | 2x2       | 160x160                      |
| M      | 3x3       | 240x240                      |
| L      | 4x4       | 320x320                      |
| XL     | 5x5       | 400x400                      |

**Size distribution** (approximate):
- XS: 35% of tiles
- S: 30% of tiles
- M: 20% of tiles
- L: 10% of tiles
- XL: 5% of tiles

### Arrangement

- Albums are packed into a **CSS Grid with dense auto-flow**, filling gaps automatically.
- The grid should extend **wider than the viewport** to allow horizontal scrolling animation.
- No visible gaps between tiles.

### Animation

- The entire grid slowly animates horizontally, panning left and right.
- The animation should be smooth and continuous (CSS `translateX` keyframe).
- Duration should be long enough to feel ambient, not distracting (~60-120 seconds per cycle).
- The grid should be wide enough that the animation doesn't reveal empty space.

## Content Rules

### No Duplicates

- Each unique album should appear **at most once** in the visible grid.
- If there are not enough unique albums to fill the grid, it is acceptable to repeat, but duplicates should be spread out (not adjacent).

### No Singles

- Albums with `album_type: "single"` should be **filtered out** on the server side before sending to the client.
- Only `album_type: "album"` and `album_type: "compilation"` should be included.
- Singles typically have less recognizable cover art and degrade the visual quality of the grid.

### Image Quality

- Use the mid-size image (300x300) from Spotify's image array for bandwidth efficiency.
- Use `loading="lazy"` for native browser lazy loading.
- Images should fade in with a subtle animation when loaded.

## Bottom Gradient

A gradient at the bottom of the viewport mimics a sound wave / audio pulse effect. This provides visual grounding and separates the song card from the album grid behind it.

## Visual Reference

See `assets/player.png` and `assets/player2.png` for the target appearance.
