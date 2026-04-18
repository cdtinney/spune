import type { Page } from '@playwright/test';

// --- Mock data ---

export const mockUser = {
  spotifyId: 'test-user-123',
  displayName: 'Test User',
  photos: ['https://example.com/photo.jpg'],
};

export const mockTrack = {
  id: 'track-1',
  name: 'Midnight City',
  artists: [{ id: 'artist-1', name: 'M83' }],
  album: {
    id: 'album-1',
    name: 'Hurry Up, We Are Dreaming',
    images: [
      { url: 'https://example.com/album-300.jpg', width: 300, height: 300 },
      { url: 'https://example.com/album-64.jpg', width: 64, height: 64 },
    ],
    artists: [{ id: 'artist-1', name: 'M83' }],
  },
  duration_ms: 243000,
};

export const mockPlaybackState = {
  item: mockTrack,
  is_playing: true,
  progress_ms: 60000,
};

export const mockRelatedAlbums = Array.from({ length: 20 }, (_, i) => ({
  id: `related-album-${i}`,
  name: `Related Album ${i}`,
  images: [
    { url: `https://example.com/related-${i}-300.jpg`, width: 300, height: 300 },
    { url: `https://example.com/related-${i}-64.jpg`, width: 64, height: 64 },
  ],
  artists: [{ id: `related-artist-${i}`, name: `Artist ${i}` }],
}));

// --- Route mocking helpers ---

export async function mockAuthenticated(page: Page) {
  await page.route('**/api/auth/user', (route) => route.fulfill({ json: { user: mockUser } }));
}

export async function mockUnauthenticated(page: Page) {
  await page.route('**/api/auth/user', (route) => route.fulfill({ json: {} }));
}

export async function mockPlayback(page: Page, state = mockPlaybackState) {
  await page.route('**/api/spotify/me/player', (route) => route.fulfill({ json: state }));
}

export async function mockEmptyPlayback(page: Page) {
  await page.route('**/api/spotify/me/player', (route) => route.fulfill({ json: { item: null } }));
}

export async function mockFailingPlayback(page: Page) {
  await page.route('**/api/spotify/me/player', (route) =>
    route.fulfill({ status: 500, body: 'Internal Server Error' }),
  );
}

export async function mockRelatedAlbumsRoute(page: Page, albums = mockRelatedAlbums) {
  await page.route('**/api/spotify/currently-playing/related-albums*', (route) =>
    route.fulfill({ json: albums }),
  );
}

export async function mockSSE(page: Page) {
  // Abort SSE so the client falls back to polling (easier to mock deterministically)
  await page.route('**/api/sse/playback', (route) => route.abort('connectionrefused'));
}

/** Set up all mocks for a fully working visualization with a song playing. */
export async function mockFullVisualization(page: Page) {
  await mockAuthenticated(page);
  await mockPlayback(page);
  await mockRelatedAlbumsRoute(page);
  await mockSSE(page);
}

/** Set up all mocks for an authenticated user with no song playing. */
export async function mockEmptyVisualization(page: Page) {
  await mockAuthenticated(page);
  await mockEmptyPlayback(page);
  await mockRelatedAlbumsRoute(page);
  await mockSSE(page);
}
