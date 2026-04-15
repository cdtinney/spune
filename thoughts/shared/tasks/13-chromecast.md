# Task 13: Chromecast Support

## Status: Implemented

Cast app ID: `CCD3A879`
Receiver URL: `https://spune.tinney.dev/cast-receiver.html`

## Architecture

All Chromecast code is in `packages/client/src/cast/`:

```
cast/
  types.ts              # Shared message types and namespace
  cast-sender.d.ts      # Type declarations for Cast Sender SDK
  cast-receiver.d.ts    # Type declarations for Cast Receiver SDK
  sender/
    useCastSession.ts   # Hook: SDK lifecycle, session management
    CastButton.tsx      # UI: appears when Chromecast detected
    CastButton.css
    __tests__/          # Unit tests for CastButton
  receiver/
    ReceiverApp.tsx     # Standalone visualization app
    main.tsx            # Entry point for cast-receiver.html
```

- **Sender**: Loads Google Cast SDK, discovers devices, sends playback data + album URLs via custom namespace `urn:x-cast:com.spune.visualization`.
- **Receiver**: Standalone React app at `/cast-receiver.html` (separate Vite entry point). Renders mosaic visualization from received data. No auth needed.
- **Fallback**: Falls back to Default Media Receiver (`CC1AD845`) if `VITE_CAST_APP_ID` is not set, allowing device discovery testing without a registered custom receiver.

## Setup

1. Register a Custom Receiver in the [Google Cast Developer Console](https://cast.google.com/publish/).
2. Set receiver URL to `https://your-domain.com/cast-receiver.html`.
3. Register your Chromecast as a test device (serial number) in the Cast Developer Console. Wait for "Ready For Testing" status, then reboot the Chromecast.
4. Set `VITE_CAST_APP_ID=your-app-id` in `packages/client/.env`.
5. The Dockerfile bakes the app ID at build time via a build arg.

## Known limitations

- Custom Cast app IDs only discover Chromecasts registered as test devices (until the app is published).
- Test device registration can take 15 minutes to several hours to propagate.
- The Default Media Receiver fallback allows testing device discovery and session flow, but custom messaging (and therefore the visualization) won't work with it.
- True E2E testing requires a physical Chromecast — unit tests cover the sender UI logic.
