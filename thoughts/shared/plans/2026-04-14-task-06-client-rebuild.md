# Task 6: Client Rebuild — Vite + React 19 Implementation Plan

## Overview

Replace the dead CRA + React 16 + MUI v3 + Enzyme client with a modern Vite + React 19 app. The business logic is small (Spotify auth, now-playing polling, album grid), so we scaffold fresh and port the logic rather than attempting an incremental upgrade.

## Current State Analysis

The entire client stack is end-of-life: CRA (`react-scripts@2.1.5`), React 16, MUI v3, Enzyme, class components, Redux with `connect()` HOCs. None of this runs on modern Node without `--openssl-legacy-provider` hacks.

### Key Discoveries

- **Server contract**: Static files must build to `packages/client/build/` (hardcoded in `packages/server/src/config/paths.js:6`). Assets must use absolute paths from `/`.
- **Hash routing required**: Server has no HTML fallback route. `paths.js` references `/#/visualization` and `/#/login`. Must use `HashRouter`.
- **3 API endpoints** consumed by the client:
  - `GET /api/auth/user` — check auth status
  - `GET /api/spotify/me/player` — current playback state
  - `GET /api/spotify/currently-playing/related-albums?songId=<id>` — related albums
- **Auth is hard navigation**: Login (`/api/auth/spotify`) and logout (`/api/auth/user/logout`) use `window.location.assign`.
- **Album grid math**: `calculateColumnSize` finds the largest tile size (80-151px) that divides evenly into the viewport width, then computes tiles needed to fill the screen.
- **Polling**: 3s `setInterval` calling the now-playing endpoint; skips if previous request still loading; triggers related album fetch when album changes.
- **No `.env` files**: Client reads no environment variables.

## Desired End State

- `packages/client` is a Vite + React 19 app with zero CRA/Enzyme/MUI v3 code
- Function components + hooks throughout, React context for state (no Redux)
- Plain CSS for styling (CSS files, no CSS-in-JS framework)
- React Router v7 with `HashRouter`
- `@testing-library/react` + Vitest for tests
- Builds to `packages/client/build/` compatible with server's `express.static`
- CI workflow includes a `client` job that lints, tests, and builds
- Dev proxy forwards `/api` to `localhost:5000`

### Verification

- `npm run client:build` produces `packages/client/build/index.html`
- `npm run client:test:coverage` passes
- `npm run client:lint` passes
- CI passes (both server and client jobs)
- Dev mode: `npm run watch` starts both server and client, client proxies API calls

## What We're NOT Doing

- No SSR or RSC — this remains a plain SPA
- No migration of the service worker / PWA manifest
- No visual redesign — we replicate the existing dark theme and layout
- No new features — just porting existing functionality
- No HTML5 history routing — staying on hash routing for server compatibility
- No Redux — replacing with React context + hooks

## Implementation Approach

Nuke the existing `packages/client/src/` and `public/` directories entirely. Scaffold a new Vite app in-place, then port business logic file by file. Work in phases so each phase is independently verifiable.

---

## Phase 1: Scaffold Vite + React 19

### Overview
Remove old client code and scaffold a fresh Vite + React 19 project with the correct build config.

### Changes Required

#### 1. Clean out old client
Delete everything inside `packages/client/` except the directory itself.

#### 2. Scaffold new Vite app
Use `npm create vite@latest` with React template, then adjust:

#### 3. `packages/client/package.json`
New package.json with:
- `name: "spune-client"`
- Dependencies: `react`, `react-dom`, `react-router-dom`, `axios`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`
- Dev dependencies: `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `eslint`, `eslint-config-react-app` (or equivalent)
- Scripts:
  - `dev`: `vite`
  - `build`: `vite build`
  - `watch`: `vite` (alias for dev, used by root package.json)
  - `preview`: `vite preview`
  - `test`: `vitest run`
  - `test:watch`: `vitest`
  - `test:coverage`: `vitest run --coverage`
  - `lint`: `eslint src/`

#### 4. `packages/client/vite.config.js`
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
```

Key points:
- `build.outDir: 'build'` — matches server's expected path
- `server.proxy` — replaces CRA's `setupProxy.js`
- `base` defaults to `/` — assets get absolute paths

#### 5. `packages/client/index.html`
Vite uses `index.html` at the project root (not `public/`):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.png" />
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" rel="stylesheet" />
    <title>Spune</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 6. `packages/client/public/favicon.png`
Copy from old `public/favicon.png` (save before deletion, or retrieve from git).

#### 7. `packages/client/src/main.jsx`
Minimal entry point:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 8. `packages/client/src/App.jsx`
Placeholder:
```jsx
export default function App() {
  return <div>Spune</div>;
}
```

#### 9. `packages/client/src/index.css`
Port the global CSS from the old `index.css` and `App.css`:
- Box-sizing reset, full-height flex body, `#root` flex column
- `fadein` keyframe animation

#### 10. `packages/client/src/setupTests.js`
```js
import '@testing-library/jest-dom';
```

### Success Criteria

#### Automated Verification:
- [ ] `cd packages/client && npm run build` produces `build/index.html`
- [ ] `cd packages/client && npm run test` exits cleanly (no tests yet, should not error)
- [ ] `cd packages/client && npm run dev` starts on port 3000

#### Manual Verification:
- [ ] Opening `http://localhost:3000` shows "Spune" placeholder text

---

## Phase 2: Auth Context, API Client, and Routing

### Overview
Port the API client, auth flow, and routing infrastructure. After this phase, the login → redirect → visualization flow works.

### Changes Required

#### 1. `src/api/spotify.js` — API client
Port `SpotifyApi` as plain exported functions (no class needed):
```js
import axios from 'axios';

export async function getMe() { ... }
export async function getPlaybackState() { ... }
export async function getRelatedAlbums(songId) { ... }
```

Same 3 endpoints as the old `SpotifyApi` class. Each returns `response.data`.

#### 2. `src/contexts/UserContext.jsx` — User/auth context
Provides:
- `user` — profile object or null
- `loading` — boolean
- `error` — error or null
- `login()` — calls `window.location.assign('/api/auth/spotify')`
- `logout()` — calls `window.location.assign('/api/auth/user/logout')`

On mount, fetches `GET /api/auth/user`. Sets `user` from response.

#### 3. `src/routes.jsx` — Routing
React Router v7 with `HashRouter`:
```
/#/         → Redirect to /home
/#/home     → HomePage (or redirect to /visualization if authenticated)
/#/visualization → VisualizationPage (protected, redirects to / if not authenticated)
/#/error/:errorMsg → ErrorPage
```

`PrivateRoute` becomes a simple wrapper that checks `user` from `UserContext`.

#### 4. `src/App.jsx` — Wire up
```jsx
import { HashRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Routes from './routes';

export default function App() {
  return (
    <HashRouter>
      <UserProvider>
        <Routes />
      </UserProvider>
    </HashRouter>
  );
}
```

#### 5. `src/pages/HomePage.jsx`
Port the home page:
- Shows loading spinner while auth check is in flight
- Shows "Welcome, {name}" if authenticated (then redirects to visualization)
- Shows Spotify login button if not authenticated
- Shows error message if auth check failed

Uses `UserContext` instead of Redux `connect`.

#### 6. `src/pages/ErrorPage.jsx`
Simple functional component that reads `errorMsg` from route params.

#### 7. `src/components/LoadingScreen.jsx`
Simple CSS spinner (replaces MUI `CircularProgress`).

### Success Criteria

#### Automated Verification:
- [ ] App builds without errors
- [ ] No lint errors

#### Manual Verification:
- [ ] `npm run watch` (root) starts both server and client
- [ ] Opening `http://localhost:3000` shows the home page with Spotify login button
- [ ] Clicking login redirects to Spotify OAuth flow
- [ ] After auth, redirected to `/#/visualization` (empty for now)
- [ ] `/#/error/test` shows "test" error message

**Implementation Note**: Pause here for manual confirmation that the auth flow works end-to-end before proceeding.

---

## Phase 3: Now-Playing Polling and Spotify Context

### Overview
Port the now-playing polling mechanism and related album fetching. This is the core data layer.

### Changes Required

#### 1. `src/contexts/SpotifyContext.jsx` — Spotify state context
Provides:
- `nowPlaying` — `{ songId, songTitle, songArtists, artistName, albumId, albumName, albumImageUrl, albumArtists }` or null
- `relatedAlbums` — `{ byAlbumId, allAlbumIds }` or empty
- `loading` — boolean (now-playing request in flight)
- `albumsLoading` — boolean (related albums request in flight)
- `error` — error or null

#### 2. `src/hooks/useNowPlayingPoller.js` — Polling hook
Replaces the `NowPlayingPoller` class component. Uses `useEffect` with `setInterval`:
- Polls `getPlaybackState()` every 3 seconds
- Skips if previous request is still loading (ref-based guard)
- When song changes: updates `nowPlaying` state
- When album changes: clears related albums, fetches new ones via `getRelatedAlbums(songId)`
- Cleanup: clears interval on unmount

#### 3. Integration
`SpotifyProvider` wraps the visualization page (or sits inside `UserProvider`). The poller hook runs inside the provider.

### Success Criteria

#### Automated Verification:
- [ ] App builds without errors

#### Manual Verification:
- [ ] With Spotify playing, the visualization page shows now-playing data (even if UI is minimal)
- [ ] Related albums are fetched when song changes
- [ ] Polling stops when navigating away from visualization

**Implementation Note**: Pause here for manual confirmation that polling works before building the UI.

---

## Phase 4: Visualization Page UI

### Overview
Port all visualization page components: album grid, song card, cover overlay, user menu, fullscreen toggle.

### Changes Required

#### 1. `src/utils/calculateColumnSize.js`
Port directly — pure function, no dependencies to update.

#### 2. `src/utils/shuffle.js`
Port directly — Fisher-Yates shuffle.

#### 3. `src/hooks/useWindowSize.js`
Replaces `redux-responsive` + `react-window-size`. Simple hook:
```js
const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
// debounced resize listener
```

#### 4. `src/hooks/useAlbumGrid.js`
Combines the old selector logic:
- Takes `windowSize` and `relatedAlbums`
- Computes `imageSize` via `calculateColumnSize`
- Computes `numAlbums` to fill screen
- Shuffles and slices albums
- Returns `{ albums, imageSize }`

#### 5. `src/pages/VisualizationPage.jsx`
Main visualization page component. Replaces the old class-based view + container + index pattern with a single functional component. Contains:
- `useContext(SpotifyContext)` for now-playing and albums
- `useContext(UserContext)` for user profile
- Fullscreen toggle (using Fullscreen API directly or a small hook)
- Conditional rendering: loading → no song → song card + album grid

#### 6. `src/components/AlbumGrid.jsx`
CSS Grid layout replacing `react-masonry-component`:
```css
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, <imageSize>px);
  justify-content: center;
}
```
Each cell is an `<img>` with `loading="lazy"` (replaces `react-progressive-image`).
Fade-in animation on load using the existing `fadein` keyframe.

#### 7. `src/components/SongCard.jsx`
Port from old `SongCard` — displays song title, artist names, album name. Plain CSS styling (dark card with white text, matching the old MUI-styled version).

#### 8. `src/components/CoverOverlay.jsx`
Port the animated gradient overlay. The CSS keyframe `move-background` is the key part — port directly.

#### 9. `src/components/UserAvatar.jsx`
Displays user's Spotify profile photo. Simple `<img>` with border-radius.

#### 10. `src/components/UserMenu.jsx`
Dropdown menu with logout option. Replaces MUI `Menu`/`MenuItem` with a simple CSS dropdown. Uses `UserContext` for logout.

#### 11. `src/components/FullscreenButton.jsx`
Button that toggles fullscreen. Uses the Fullscreen API (`document.documentElement.requestFullscreen()`). Font Awesome expand icon.

#### 12. `src/components/SpotifyLoginButton.jsx`
Port from old component. Font Awesome Spotify icon + styled button.

### Success Criteria

#### Automated Verification:
- [ ] App builds without errors
- [ ] No lint errors

#### Manual Verification:
- [ ] Album grid fills the screen with square tiles
- [ ] Tiles resize correctly on window resize
- [ ] Song card shows current track info
- [ ] Cover overlay gradient animates
- [ ] User avatar and menu appear
- [ ] Logout works
- [ ] Fullscreen toggle works
- [ ] Images lazy-load with fade-in animation

**Implementation Note**: Pause here for manual confirmation that the full UI works before writing tests.

---

## Phase 5: Tests

### Overview
Write tests using Vitest + React Testing Library. Focus on business logic and key component behavior, not snapshot tests.

### Changes Required

#### 1. Unit tests for pure utilities
- `utils/__tests__/calculateColumnSize.test.js` — port existing test cases
- `utils/__tests__/shuffle.test.js` — port existing test cases

#### 2. API client tests
- `api/__tests__/spotify.test.js` — mock axios, verify correct URLs and response unwrapping

#### 3. Context tests
- `contexts/__tests__/UserContext.test.jsx` — mock API, verify auth check, login/logout
- `contexts/__tests__/SpotifyContext.test.jsx` — mock API, verify polling, album fetching

#### 4. Hook tests
- `hooks/__tests__/useNowPlayingPoller.test.js` — verify interval setup/cleanup, loading guard
- `hooks/__tests__/useWindowSize.test.js` — verify resize handling
- `hooks/__tests__/useAlbumGrid.test.js` — verify grid math

#### 5. Component tests
- `pages/__tests__/HomePage.test.jsx` — renders login button when unauthenticated, redirects when authenticated
- `pages/__tests__/ErrorPage.test.jsx` — renders error message from route params
- `components/__tests__/AlbumGrid.test.jsx` — renders correct number of images
- `components/__tests__/SongCard.test.jsx` — renders song info

#### 6. Route tests
- `__tests__/routes.test.jsx` — protected route redirects, public routes render

### Success Criteria

#### Automated Verification:
- [ ] `npm run client:test:coverage` passes with all tests green
- [ ] No lint errors: `npm run client:lint`

---

## Phase 6: CI Integration and Final Cleanup

### Overview
Add a client job to the GitHub Actions workflow. Clean up any remaining old files.

### Changes Required

#### 1. `.github/workflows/ci.yml` — Add client job
```yaml
client:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: npm
    - name: Install dependencies
      run: npm ci --install-strategy=hoisted
    - name: Lint
      run: npm run client:lint
    - name: Test
      run: npm run client:test:coverage
    - name: Build
      run: npm run client:build
```

No Postgres needed for the client job.

#### 2. Root `package.json` — Update scripts if needed
Ensure `client:lint`, `client:test`, `client:test:coverage`, `client:build` all delegate correctly to the new Vite scripts.

#### 3. Cleanup
- Remove any old CRA files that survived (e.g., old `build/` output in git)
- Ensure `.gitignore` covers `packages/client/build/`, `packages/client/node_modules/`, `packages/client/coverage/`
- Remove `setupProxy.js` (proxy is now in `vite.config.js`)

#### 4. Verify the full build pipeline
- `npm ci && npm run client:build` → `packages/client/build/index.html` exists
- Server can serve the built client in production mode

### Success Criteria

#### Automated Verification:
- [ ] `npm run client:lint` passes
- [ ] `npm run client:test:coverage` passes
- [ ] `npm run client:build` succeeds
- [ ] `npm run server:test:coverage` still passes (no regressions)
- [ ] CI passes on the feature branch (both server and client jobs)

#### Manual Verification:
- [ ] `NODE_ENV=production npm run server:start` serves the built client at `http://localhost:5000`
- [ ] Full flow works: login → visualization → album grid → logout

---

## Testing Strategy

### Unit Tests (Vitest):
- Pure utility functions: `calculateColumnSize`, `shuffle`
- API client: correct URLs, response unwrapping
- Contexts: auth check, state transitions
- Hooks: polling lifecycle, window resize, grid math

### Component Tests (React Testing Library):
- Pages render correct content based on auth state
- Protected routes redirect when unauthenticated
- Album grid renders images
- Song card displays track info

### Integration (Manual):
- Full auth flow via Spotify OAuth
- Now-playing polling with live Spotify playback
- Album grid responsiveness on resize
- Fullscreen toggle
- Build + serve via Express in production mode

## References

- Task spec: `thoughts/shared/tasks/06-client-rebuild.md`
- Server static serving: `packages/server/src/config/paths.js:6`, `packages/server/src/initApp.js:57-61`
- Current client entry: `packages/client/src/index.js`
- Current API client: `packages/client/src/api/SpotifyApi.js`
- Current polling: `packages/client/src/pages/VisualizationPage/components/NowPlayingPoller/view.js`
- Current grid math: `packages/client/src/utils/calculateColumnSize.js`, `packages/client/src/selectors/uiSelectors.js`
