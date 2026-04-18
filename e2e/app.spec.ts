import { test, expect } from '@playwright/test';
import { mockUnauthenticated } from './fixtures';

test.describe('Home page', () => {
  test('shows logo, title, and login button', async ({ page }) => {
    await mockUnauthenticated(page);
    await page.goto('/');

    await expect(page).toHaveTitle('Spune');
    await expect(page.locator('img[alt="Spune Logo"]')).toBeVisible();
    await expect(page.locator('#button-login')).toBeVisible();
    await expect(page.locator('#button-login')).toContainText('LOG IN WITH SPOTIFY');
  });
});

test.describe('Error page', () => {
  test('shows error message from URL', async ({ page }) => {
    await page.goto('/#/error/Something%20went%20wrong');
    await expect(page.locator('h2')).toContainText('Oops! Something bad happened.');
    await expect(page.locator('p')).toContainText('Something went wrong');
  });
});

test.describe('Protected routes', () => {
  test('redirects /visualization to /home when not logged in', async ({ page }) => {
    await mockUnauthenticated(page);
    await page.goto('/#/visualization');
    await page.waitForURL('**/home');
    await expect(page.locator('#button-login')).toBeVisible();
  });
});
