# Task 12: UI Improvements

## Goal

Polish the visualization UI to more closely match the Zune aesthetic.

## What to do

### Album grid mosaic
The current fixed-template mosaic works but has limitations:
- Only 2 tile sizes (1x1 and 2x2) — the original Zune had more variety.
- The repeating 6x6 pattern is visible on large screens.
- Consider multiple template patterns that alternate to reduce visual repetition.
- Consider a 3rd tile size (e.g., 3x3) for flagship albums.
- The diagonal drift animation could be smoother — consider using `will-change: transform` and GPU-accelerated properties.

### Album tile flip animation
The original Zune periodically flipped individual tiles to reveal new album artwork:
- Add a CSS 3D flip animation (`rotateY(180deg)`) on random tiles.
- Swap the image src at the 90-degree point.
- Trigger flips on a random interval (e.g., every 5-15 seconds per tile).

### Color overlay
- The gradient overlay could shift colors based on the current album's dominant color.
- Use a color extraction library (e.g., `color-thief`) on the album art to derive the palette.

### Song card
- Add a smooth transition when the song changes (crossfade).
- The album art in the song card could have a subtle shadow/glow matching the album's dominant color.

### Responsive design
- Test and fix layout on mobile/tablet screens.
- The song card and controls should adapt to smaller viewports.
- Consider hiding the GitHub link on mobile.

### Accessibility
- Add proper ARIA labels to interactive elements.
- Ensure keyboard navigation works (fullscreen toggle, user menu).
- Ensure sufficient color contrast for text over the overlay.

### Loading improvements
- When the song/app first loads, there should be UX that indicates something is loading (vs a blank screen).

### Playback position
- If there's way to implement song position UI (e.g. a bar at the bottom) without overloading the API/server, do it.

## Visual reference

See `assets/player.png`, `assets/player2.png`, and `docs/album-grid-requirements.md`.
