# Ambient Mode Enhancements

## Goal

Make the visualization more customizable and suitable for long-running ambient display use (e.g., TV screensaver overnight).

## Enhancements

### 1. Sleep/dim mode

After a configurable period of inactivity (e.g., 30 minutes), gradually dim the visualization:

- Reduce overall brightness via an opacity overlay
- Slow the mosaic drift to near-stop
- Reduce tile flip frequency
- Fade the song card and progress bar to very low opacity

Mouse movement or a new song change exits sleep mode with a smooth transition back.

This reduces burn-in risk on OLED TVs and makes Spune viable as an overnight display.

### 2. Configurable animation speed

Expose a settings panel (gear icon or within the help dialog) with controls for:

- **Drift speed**: slow / normal / fast (maps to mosaic-drift animation duration: 300s / 180s / 90s)
- **Flip frequency**: rare / normal / frequent (maps to ambient flip interval: 15s / 8s / 4s)

Store preferences in localStorage. Apply via CSS custom properties or by passing config to the AlbumGrid component.

### 3. Tile size options

Allow switching between tile density:

- **Large**: 120px tiles (fewer, more visible album art)
- **Normal**: 100px tiles (current default)
- **Small**: 70px tiles (denser mosaic, more variety visible)

The `useAlbumGrid` hook already accepts tile size as a constant — make it configurable via the same settings panel.

### 4. Color theme options

Allow overriding the default gradient palette:

- **Default**: current multi-color gradient
- **Monochrome**: grayscale gradient, dominant color overlay only
- **Album-reactive**: gradient colors derived entirely from the current album art (stronger dominant color influence)

Implement by swapping CSS custom properties for the gradient stops in CoverOverlay.

## Settings storage

All preferences stored in localStorage under a `spune-settings` key as a JSON object. Read on mount via a `useSettings` hook that provides current values and a setter. No server-side storage needed — these are per-device preferences.

## UI

A small gear icon in the top-left (next to the existing help/GitHub icon), opening a settings panel with the controls. Reuse the dropdown-panel pattern from HelpDialog/UserMenu.

For the Chromecast receiver: settings are not applicable (no user interaction). The receiver always uses default values.
