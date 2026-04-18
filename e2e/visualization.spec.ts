import { test, expect } from '@playwright/test';
import {
  mockFullVisualization,
  mockEmptyVisualization,
  mockAuthenticated,
  mockFailingPlayback,
  mockRelatedAlbumsRoute,
  mockSSE,
  mockTrack,
  mockUser,
} from './fixtures';

test.describe('Visualization — song playing', () => {
  test('renders song card, album grid, progress bar, and user controls', async ({ page }) => {
    await mockFullVisualization(page);
    await page.goto('/#/visualization');

    // Song card shows track info (artist and album are rendered uppercase)
    const songCard = page.getByTestId('song-card');
    await expect(songCard).toBeVisible();
    await expect(page.getByTestId('song-artist')).toContainText(
      mockTrack.artists[0].name.toUpperCase(),
    );
    await expect(page.getByTestId('song-album')).toContainText(mockTrack.album.name.toUpperCase());
    await expect(page.getByTestId('song-title')).toContainText(mockTrack.name);

    // Album grid renders with tiles
    await expect(page.getByTestId('album-grid')).toBeVisible();

    // Progress bar is visible
    await expect(page.getByTestId('progress-bar')).toBeVisible();

    // User controls and GitHub icon are visible
    const userControls = page.getByTestId('user-controls');
    await expect(userControls).toBeVisible();
    await expect(userControls.locator(`[title="${mockUser.displayName}"]`)).toBeVisible();
    await expect(page.getByTestId('github-link')).toBeVisible();
  });
});

test.describe('Visualization — no song playing', () => {
  test('shows empty message and hides playback UI', async ({ page }) => {
    await mockEmptyVisualization(page);
    await page.goto('/#/visualization');

    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toContainText('No song playing');

    // Playback UI should NOT be visible
    await expect(page.getByTestId('song-card')).not.toBeVisible();
    await expect(page.getByTestId('album-grid')).not.toBeVisible();
    await expect(page.getByTestId('progress-bar')).not.toBeVisible();
  });
});

test.describe('Visualization — error state', () => {
  test('shows error overlay with reconnect button after consecutive failures', async ({ page }) => {
    await mockAuthenticated(page);
    await mockFailingPlayback(page);
    await mockRelatedAlbumsRoute(page);
    await mockSSE(page);
    await page.goto('/#/visualization');

    const errorOverlay = page.getByTestId('error-overlay');
    await expect(errorOverlay).toBeVisible({ timeout: 15000 });
    await expect(errorOverlay).toContainText('Session expired or connection failed');
    await expect(errorOverlay.locator('button')).toContainText('Reconnect with Spotify');
  });
});

test.describe('Visualization — background layers', () => {
  test('renders gradient overlay and bottom gradient', async ({ page }) => {
    await mockFullVisualization(page);
    await page.goto('/#/visualization');

    await expect(page.getByTestId('cover-overlay')).toBeVisible();
    await expect(page.locator('.visualization__bottom-gradient')).toBeVisible();
  });
});
