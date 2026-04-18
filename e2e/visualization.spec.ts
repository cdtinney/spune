import { test, expect } from '@playwright/test';
import {
  mockFullVisualization,
  mockAuthenticated,
  mockEmptyPlayback,
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

    // Song card shows track info
    const songCard = page.locator('.song-card');
    await expect(songCard).toBeVisible();
    // Artist and album are rendered uppercase
    await expect(songCard.locator('.song-card__artist')).toContainText(
      mockTrack.artists[0].name.toUpperCase(),
    );
    await expect(songCard.locator('.song-card__album')).toContainText(
      mockTrack.album.name.toUpperCase(),
    );
    await expect(songCard.locator('.song-card__title')).toContainText(mockTrack.name);

    // Album grid renders with tiles
    await expect(page.locator('.album-grid')).toBeVisible();
    const tiles = page.locator('.album-grid__tile');
    await expect(tiles.first()).toBeVisible();
    expect(await tiles.count()).toBeGreaterThan(0);

    // Progress bar is visible with time labels
    const progressBar = page.locator('.progress-bar');
    await expect(progressBar).toBeVisible();
    await expect(progressBar.locator('.progress-bar__time').first()).toBeVisible();

    // User avatar is visible with correct display name
    const avatar = page.locator('.visualization__user-container');
    await expect(avatar).toBeVisible();
    await expect(avatar.locator(`[title="${mockUser.displayName}"]`)).toBeVisible();

    // GitHub icon is visible
    await expect(page.locator('.visualization__github-icon')).toBeVisible();
  });
});

test.describe('Visualization — no song playing', () => {
  test('shows empty message and hides playback UI', async ({ page }) => {
    await mockAuthenticated(page);
    await mockEmptyPlayback(page);
    await mockRelatedAlbumsRoute(page);
    await mockSSE(page);
    await page.goto('/#/visualization');

    await expect(page.locator('.visualization__empty')).toBeVisible();
    await expect(page.locator('.visualization__empty')).toContainText('No song playing');

    // Song card, album grid, and progress bar should NOT be visible
    await expect(page.locator('.song-card')).not.toBeVisible();
    await expect(page.locator('.album-grid')).not.toBeVisible();
    await expect(page.locator('.progress-bar')).not.toBeVisible();
  });
});

test.describe('Visualization — error state', () => {
  test('shows error overlay with reconnect button after consecutive failures', async ({ page }) => {
    await mockAuthenticated(page);
    await mockFailingPlayback(page);
    await mockRelatedAlbumsRoute(page);
    await mockSSE(page);
    await page.goto('/#/visualization');

    // Wait for consecutive errors to trigger the error state
    const errorBlock = page.locator('.visualization__error');
    await expect(errorBlock).toBeVisible({ timeout: 15000 });
    await expect(errorBlock).toContainText('Session expired or connection failed');
    await expect(errorBlock.locator('.btn-primary')).toContainText('Reconnect with Spotify');
  });
});

test.describe('Visualization — background layers', () => {
  test('renders gradient overlay, color overlay, darken layer, and bottom gradient', async ({
    page,
  }) => {
    await mockFullVisualization(page);
    await page.goto('/#/visualization');

    await expect(page.locator('.cover-overlay')).toBeVisible();
    await expect(page.locator('.cover-overlay__gradient')).toBeVisible();
    await expect(page.locator('.cover-overlay__darken')).toBeVisible();
    await expect(page.locator('.visualization__bottom-gradient')).toBeVisible();
  });
});
