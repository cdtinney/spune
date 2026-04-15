# Chromecast Integration

Spune can cast the album art visualization to a Chromecast-enabled TV — the original Zune living room experience.

## How it works

### Sender (main app)

The sender runs in the browser (Chrome only). When a Chromecast is detected on the local network, a cast icon appears in the bottom-right corner of the visualization page.

1. The Google Cast Sender SDK is loaded on page mount.
2. The SDK discovers Chromecast devices that support the configured app ID.
3. Clicking the cast button opens Chrome's device picker.
4. Once connected, the sender pushes playback data to the receiver on every poll update (every 3 seconds):
   - Song title, artist, album name, album image URL
   - Playback progress and duration
   - All related album image URLs for the mosaic grid

**Code**: `packages/client/src/cast/sender/`

### Receiver (Chromecast app)

The receiver is a standalone React app that the Chromecast loads from your server. It renders the full mosaic visualization using data received from the sender.

- No authentication needed — all data comes via Cast messaging
- Reuses the same components as the main app (AlbumGrid, SongCard, CoverOverlay, ProgressBar)
- Separate Vite entry point at `cast-receiver.html`

**Code**: `packages/client/src/cast/receiver/`

### Messaging protocol

Messages are sent over a custom Cast namespace: `urn:x-cast:com.spune.visualization`

```typescript
interface CastMessage {
  type: 'UPDATE_PLAYBACK';
  nowPlaying: {
    songId: string;
    songTitle: string;
    artistName: string;
    albumName: string;
    albumImageUrl: string | undefined;
    progressMs: number;
    durationMs: number;
    isPlaying: boolean;
  };
  albumImageUrls: string[]; // All related album cover URLs for the mosaic
}
```

## Setup

### 1. Google Cast Developer Console

1. Go to [cast.google.com/publish](https://cast.google.com/publish/).
2. Pay the $5 one-time developer fee (if not already done).
3. Click **Add New Application** → **Custom Receiver**.
4. Set the Receiver Application URL to: `https://your-domain.com/cast-receiver.html`
5. Note the **Application ID** (e.g., `CCD3A879`).

### 2. Register test device

Unpublished Cast apps only discover Chromecasts that are registered as test devices.

1. In the Cast Developer Console, click **Add New Device**.
2. Enter your Chromecast's serial number (found in Google Home app → device settings, or on the back of the device).
3. Wait for status to show **"Ready For Testing"**.
4. Reboot the Chromecast (Google Home → device settings → reboot).
5. Registration can take 15 minutes to several hours to propagate.

### 3. Configure the app

Set the Cast app ID in the client environment:

```bash
# packages/client/.env
VITE_CAST_APP_ID=CCD3A879
```

The Dockerfile also bakes this in at build time:

```dockerfile
ARG VITE_CAST_APP_ID=CCD3A879
```

### 4. Deploy

The receiver page (`cast-receiver.html`) is built automatically as part of `pnpm client:build`. No separate build step needed.

## Testing locally

### Prerequisites

- Google Chrome (Cast SDK only works in Chrome)
- Chromecast on the same Wi-Fi network as your dev machine
- Chromecast registered as a test device (see above)

### Steps

1. Set `VITE_CAST_APP_ID` in `packages/client/.env`
2. Run `pnpm dev`
3. Open `http://127.0.0.1:3000` in Chrome
4. The cast icon appears in the bottom-right when the Chromecast is detected
5. Click it to start casting

### Testing device discovery without a registered app

If your test device registration hasn't propagated yet, you can temporarily remove `VITE_CAST_APP_ID` from `.env`. The SDK falls back to the Default Media Receiver (`CC1AD845`), which discovers all Chromecasts. The cast button and session flow will work, but the TV will show "Default Media Receiver" instead of the visualization.

## Troubleshooting

### Cast button doesn't appear

- **Not using Chrome**: The Cast SDK only works in Google Chrome.
- **Different network**: Your computer and Chromecast must be on the same Wi-Fi.
- **Test device not registered**: Unpublished apps only discover registered test devices. Check the Cast Developer Console.
- **Registration not propagated**: After registering a test device, reboot the Chromecast and wait up to a few hours.
- **No app ID configured**: Check that `VITE_CAST_APP_ID` is set in `packages/client/.env` and the dev server was restarted after setting it.

### Casting connects but TV shows "Default Media Receiver"

`VITE_CAST_APP_ID` is not set or the test device registration hasn't propagated. The SDK is falling back to the default receiver.

### Cast messaging fails with "invalid_parameter"

You're connected to the Default Media Receiver, which doesn't support custom namespaces. This error is silently suppressed. Wait for test device registration to propagate.

### Receiver loads but shows a blank screen

The receiver page may not be deployed. Verify `https://your-domain.com/cast-receiver.html` loads in a browser.
