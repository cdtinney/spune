# Task 13: Chromecast Support

## Goal

Allow users to cast the Spune visualization to a TV via Chromecast, so it functions as a living room "now playing" display — the original Zune use case.

## Context

Spune is designed to be displayed on a TV. Currently the only way to do that is to open the browser on the TV itself or mirror a tab. Chromecast support would let users cast the visualization directly from their phone or laptop to any Chromecast-enabled display.

## What to do

### Research
- Investigate the Google Cast SDK (Web Sender + Web Receiver).
- Determine whether a **Custom Receiver** (full HTML page on the Chromecast) or **Styled Media Receiver** is appropriate. Spune is a custom visualization, not standard media playback, so a Custom Receiver is likely needed.
- Understand the Chromecast app registration process (requires a Google Cast Developer Console account, $5 one-time fee).

### Implementation
- **Cast button**: Add a Chromecast icon to the UI (top bar, near the user menu) that initializes a cast session.
- **Custom Receiver**: Build a lightweight receiver app that loads the Spune visualization. The receiver could either:
  - Load the same client app in a stripped-down mode (no login UI, just the visualization), with the sender passing the auth token, OR
  - Receive now-playing data and album images from the sender via Cast messaging.
- **Sender**: The existing client sends playback state and album data to the receiver over the Cast channel.
- **Fallback**: If no Chromecast is available, the cast button should not appear.

### Considerations
- The Chromecast receiver runs in a constrained environment (limited memory, no user interaction). The mosaic grid with hundreds of tiles may need to be simplified for the receiver.
- Spotify's terms of service may restrict proxying playback data to another device — verify this.
- The receiver app needs to be hosted at a publicly accessible HTTPS URL and registered with Google.

## Done when

- A Chromecast button appears in the UI when a cast target is available.
- Clicking it casts the visualization to the Chromecast.
- The visualization updates on the TV as songs change.
- Works with the existing Spotify auth flow.
