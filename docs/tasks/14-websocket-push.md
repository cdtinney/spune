# Task 14: WebSocket Push Architecture

## Goal

Evaluate and potentially replace the 3-second polling model with WebSocket push for real-time playback updates.

## Context

The client currently polls `GET /api/spotify/me/player` every 3 seconds. This works but:

- Wastes bandwidth when nothing changes (most polls return the same data).
- Has up to 3 seconds of latency before detecting a song change.
- Generates significant server load (each poll triggers a Spotify API call).
- Rate limiting must be generous to accommodate polling.

A WebSocket connection would let the server push updates only when state changes.

## What to do

### Phase 1: Research and decide

- **Evaluate hybrid approach**: Server polls Spotify at a fixed interval (e.g., 3s) but only pushes to connected clients when data changes. This reduces client-server traffic without requiring Spotify webhooks (which don't exist for playback state).
- **Consider Server-Sent Events (SSE)** as a simpler alternative to WebSockets — one-directional push is all that's needed.
- **Evaluate Spotify Connect state change events** — check if there's any webhook/push mechanism for playback changes.

### Phase 2: Implementation (if decided to proceed)

- Add `ws` or `socket.io` to the Express server.
- Server maintains a single polling loop to Spotify (not per-client).
- When playback state changes, broadcast to all connected WebSocket clients.
- Client connects via WebSocket on mount, falls back to polling if WebSocket fails.
- Related albums are still fetched on-demand (not pushed) since they're expensive.

### Phase 3: Fallback

- Keep the polling implementation as a fallback for environments where WebSockets are blocked (corporate proxies, etc.).
- Client should auto-detect: try WebSocket first, fall back to polling after a timeout.

## Trade-offs

| Aspect         | Polling                  | WebSocket/SSE                  |
| -------------- | ------------------------ | ------------------------------ |
| Simplicity     | Simple, stateless        | Requires connection management |
| Latency        | Up to 3s                 | Near-instant                   |
| Bandwidth      | High (constant requests) | Low (only on change)           |
| Server load    | Per-client polling       | Single poll, broadcast         |
| Infrastructure | Works everywhere         | May be blocked by proxies      |
| Scaling        | Linear with clients      | Efficient broadcast            |

## Done when

- A decision document exists with benchmarks and recommendation.
- If implementing: WebSocket/SSE push works with polling fallback.
- No regression in functionality for users behind restrictive networks.
