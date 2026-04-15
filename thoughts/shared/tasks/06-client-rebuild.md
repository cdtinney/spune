# Task 6: Client Rebuild — Vite + React 19

## Prerequisites

Task 5 (GitHub Actions) is merged. The server is fully functional and CI is running.

## Goal

Replace the dead client stack (CRA + React 16 + MUI v3 + Enzyme) with a modern equivalent. Simplify. This is the biggest task.

## Context

The entire client stack is end-of-life:

- **Create React App** (`react-scripts@2.1.5`): Archived, won't run on modern Node.
- **React 16**: Current is 19. All components are class-based.
- **Material UI v3** (`@material-ui/core`): Renamed to `@mui/material` in v5, completely different styling system. Every component uses `withStyles`.
- **Enzyme**: Dead — no adapter for React 17+.
- **Redux**: Uses deprecated `createStore` and `connect()` HOC.
- **Dead packages**: `connected-react-router`, `redux-responsive`, `react-masonry-component`, `react-progressive-image`, `react-window-size`.

The client's business logic is relatively small:

- Spotify auth flow (login/logout, redirect handling)
- Polling for currently playing track (3s interval)
- Fetching and displaying related albums as a grid of artwork
- Responsive layout with fullscreen toggle

## What to do

Given the volume of dead dependencies, scaffold a **new Vite + React 19 app** inside `packages/client` and port the business logic. Do NOT attempt to incrementally upgrade.

- Scaffold with Vite (`npm create vite@latest`).
- Use modern equivalents:
  - React 19 with function components and hooks.
  - MUI v6 (`@mui/material`) or a lighter alternative (the UI is simple enough that Tailwind or plain CSS might suffice).
  - React Router v7 (or v6) — the app has 3 routes: home, visualization, error.
  - Redux Toolkit if state management is still needed, or just React context/hooks — the state is simple (current user, now playing, related albums, loading/error flags).
  - `@testing-library/react` for tests instead of Enzyme.
  - CSS Grid or a lightweight masonry library for the album grid (replacing `react-masonry-component`).
  - Native `loading="lazy"` on images (replacing `react-progressive-image`).
- Port the business logic from the existing actions/reducers/selectors. The key flows are:
  - Auth: check if user is logged in, redirect to login if not, handle logout.
  - Polling: `setInterval` that calls the server's now-playing endpoint.
  - Album grid: fetch related albums when the song changes, render artwork.
- Keep the existing `setupProxy.js` pattern for local dev (proxy `/api` to the Express server).
- Update the dev proxy to use the current `http-proxy-middleware` API.
- Make sure the client builds to `packages/client/build` (or update the server's static file serving path in `packages/server/src/config/paths.js`).

## Done when

- `packages/client` is a Vite + React 19 app with no CRA, Enzyme, or MUI v3 code.
- The app builds, runs in dev mode, and proxies to the server.
- Core features work: login, see currently playing track, see album artwork grid.
- Basic tests exist using React Testing Library.
- CI passes (update GitHub Actions workflow if needed).
- All changes are on a feature branch off master, submitted as a PR. Do not merge directly to master.
