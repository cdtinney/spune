# Album Grid UI Requirements

## Layout

The album grid is a full-viewport background mosaic of album artwork displayed behind a semi-transparent color overlay. It is the primary visual element of the visualization page.

### Tile Sizes

Albums are displayed at **5 different sizes**. Within each row, tiles vary in size to create visual variety — rows are NOT uniform height strips.

| Size | Approx Pixels |
| ---- | ------------- |
| XS   | 80x80         |
| S    | 160x160       |
| M    | 240x240       |
| L    | 320x320       |
| XL   | 400x400       |

**Size distribution** (approximate):

- XS: 35% of tiles
- S: 30% of tiles
- M: 20% of tiles
- L: 10% of tiles
- XL: 5% of tiles

Large tiles (L/XL) should not appear consecutively.

### Arrangement

- Albums are arranged in horizontal rows that scroll independently.
- Each row contains tiles of **mixed sizes** for visual variety.
- Rows extend **~2.5x wider than the viewport** to allow horizontal scrolling animation.
- No visible gaps between tiles.

### Animation

- Individual rows animate independently, scrolling horizontally.
- **Even rows pan left**, **odd rows pan right** — creating a layered, organic effect.
- Each row has a slightly different animation speed (~60-120 seconds per cycle).
- Animation is smooth and continuous (`translateX` keyframe, `ease-in-out`, `infinite alternate`).

## Content Rules

### No Duplicates

- Each unique album should appear **at most once** in the visible grid.
- Only repeat albums after exhausting all unique albums in the pool.
- When repeating is necessary, re-shuffle to avoid adjacent duplicates.

### No Singles

- Albums with `album_type: "single"` are **filtered out** on the server side.
- Only `album_type: "album"` and `album_type: "compilation"` are included.

### Image Quality

- Use the mid-size image (300x300) from Spotify's image array for bandwidth efficiency.
- Use `loading="lazy"` for native browser lazy loading.
- Images fade in with a subtle opacity transition when loaded.

## Bottom Gradient

A gradient at the bottom of the viewport mimics a sound wave / audio pulse effect. It gently pulses in height and opacity (~4 second cycle), providing visual grounding and separating the song card from the album grid behind it.

## Visual Reference

See `assets/player.png` and `assets/player2.png` for the target appearance.
