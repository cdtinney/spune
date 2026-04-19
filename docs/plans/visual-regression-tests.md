# Visual Regression Tests

## Goal

Catch unintended visual changes during refactors by comparing screenshots against known-good baselines.

## Approach

Use Playwright's built-in `expect(page).toHaveScreenshot()` with the existing mocked API fixtures from `e2e/fixtures.ts`.

## Screenshots to capture

1. **Song playing** — Full visualization with song card, album grid, progress bar
2. **No song playing** — Empty state with "No song playing" message
3. **Error state** — Error overlay with reconnect button
4. **Home page** — Logo and login button
5. **Mobile viewport** — Song playing state at 375px width

## Implementation

1. Add a new test file `e2e/visual.spec.ts`
2. Each test navigates to the state, waits for stability, and calls `toHaveScreenshot()`
3. Baselines are committed to the repo (Playwright stores them in `e2e/visual.spec.ts-snapshots/`)
4. CI runs `pnpm test:e2e` which fails if screenshots drift beyond the threshold

## Considerations

- **Animation stability**: The mosaic drift and gradient animations will cause flaky screenshots. Options:
  - Inject `* { animation: none !important; transition: none !important; }` via `page.addStyleTag()` before capturing
  - Use `maxDiffPixelRatio` threshold (e.g., 0.01) to tolerate minor animation frame differences
  - Recommended: disable animations for screenshot tests
- **Font rendering**: May differ across CI and local. Use a consistent Docker-based CI environment or set `maxDiffPixelRatio`
- **Album images**: Already mocked as `example.com` URLs that won't load — the tiles will show as blank squares, which is fine for layout regression testing. Alternatively, serve local placeholder images via a test fixture
