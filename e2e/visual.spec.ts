import { test, expect } from '@playwright/test';
import {
  mockFullVisualization,
  mockEmptyVisualization,
  mockUnauthenticated,
  mockAuthenticated,
  mockFailingPlayback,
  mockRelatedAlbumsRoute,
  mockSSE,
  disableAnimations,
  takeScreenshot,
} from './fixtures';

test.describe('Visual regression', () => {
  test('home page', async ({ page }) => {
    await mockUnauthenticated(page);
    await page.goto('/');
    await expect(page.locator('#button-login')).toBeVisible();
    await disableAnimations(page);
    await expect(page).toHaveScreenshot('home-page.png');
  });

  test('visualization — song playing', async ({ page }) => {
    await mockFullVisualization(page);
    await page.goto('/#/visualization');
    await takeScreenshot(page, 'song-card', 'visualization-song-playing.png');
  });

  test('visualization — no song playing', async ({ page }) => {
    await mockEmptyVisualization(page);
    await page.goto('/#/visualization');
    await takeScreenshot(page, 'empty-state', 'visualization-empty.png');
  });

  test('visualization — error state', async ({ page }) => {
    await mockAuthenticated(page);
    await mockFailingPlayback(page);
    await mockRelatedAlbumsRoute(page);
    await mockSSE(page);
    await page.goto('/#/visualization');
    await takeScreenshot(page, 'error-overlay', 'visualization-error.png');
  });

  test('visualization — mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mockFullVisualization(page);
    await page.goto('/#/visualization');
    await takeScreenshot(page, 'song-card', 'visualization-mobile.png');
  });
});
