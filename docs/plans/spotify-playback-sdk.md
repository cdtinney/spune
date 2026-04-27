# Spotify Web Playback SDK Integration

## Goal

Reduce polling by using the Spotify Web Playback SDK to receive real-time playback events when Spune is the active device.

## Background

The Web Playback SDK creates a Spotify Connect device in the browser. When active, it provides push-based `player_state_changed` events — no polling needed.

**Key limitation**: `player_state_changed` only fires when the browser tab IS the active playback device. When the user plays on their phone or desktop client, the SDK goes silent and polling must resume. There is no public API for push-based playback state from external devices.

## Current architecture

Spune uses SSE (server-side polling → push to client) as the primary path, with client-side polling as a fallback. The server polls Spotify's `GET /me/player` every 3 seconds per connected SSE client.

## Proposed architecture

Add the Web Playback SDK as a **third data source** alongside SSE and polling:

1. **SDK active** (Spune is the playback device): Use `player_state_changed` events directly. No server polling needed.
2. **SDK inactive** (external device): Fall back to current SSE → polling chain.

The SDK path runs entirely client-side, bypassing the server for playback state. Related album fetches still go through the server.

## Implementation

### 1. Load the SDK

Add the Spotify Web Playback SDK script tag. Initialize a `Spotify.Player` instance with the user's access token. Register the device with a name like "Spune".

### 2. New hook: `useSpotifyPlayer`

Returns:

- `isActive: boolean` — whether Spune is the current playback device
- `playerState: WebPlaybackState | null` — latest state from `player_state_changed`
- `deviceId: string | null` — for transfer-playback API calls

### 3. Integrate with `useNowPlayingPoller`

Add a third priority level:

```
if (sdk.isActive) → use SDK state (no polling)
else if (sse.connected) → use SSE state
else if (!sse.gaveUp) → use polling fallback
```

The SDK state maps to the same `NowPlaying` shape via `mapToNowPlaying`.

### 4. "Play on Spune" button

Add a button that calls `PUT /me/player` with the Spune device ID to transfer playback. This makes Spune the active device, activating the SDK path.

## Considerations

- **Premium required**: The Web Playback SDK requires Spotify Premium for end users. Spune must degrade gracefully — if the SDK fails to initialize, fall back to SSE/polling silently.
- **Token management**: The SDK needs a client-side access token. Currently tokens are server-side only. Options:
  - Pass the token to the client via a new API endpoint
  - Use the SDK's token refresh callback to request fresh tokens from the server
- **Concurrent device**: When the user switches away from Spune, the SDK fires a final `player_state_changed` with `paused: true` and empty state. Detect this and fall back to SSE/polling.
- **Chromecast interaction**: If casting, the SDK should not be initialized — the receiver handles its own display.
