# Multi-User Party Mode

## Goal

Multiple users contribute to the mosaic simultaneously — each person's currently playing music adds albums to the shared visualization.

## Why not Spotify Jams?

Spotify Jams (formerly Group Session) has **no public API** as of April 2026. No endpoints exist to create, join, or query Jams. Spotify has hinted at future SDK support but given no timeline. This plan uses a custom room system instead.

## Concept

A "room" is a shared visualization that aggregates playback data from multiple authenticated Spotify users. One person creates a room and shares a link. Others join. The mosaic displays a merged pool of everyone's related albums, and the song card cycles between participants' currently playing tracks.

## Architecture

### Room management

- **Server**: New `rooms` table in PostgreSQL with columns: `id`, `code` (short joinable code), `created_by`, `created_at`
- **Server**: New `room_members` table: `room_id`, `user_id`, `joined_at`
- **API**: `POST /api/rooms` (create), `POST /api/rooms/:code/join`, `DELETE /api/rooms/:code/leave`, `GET /api/rooms/:code` (get members + state)

### Playback aggregation

- The server already polls Spotify per-user for SSE. Extend the `PlaybackBroadcaster` to track which room each user is in.
- When broadcasting, aggregate all room members' playback states into a combined payload.
- Each member's related albums are fetched independently and merged (deduplicated).

### Client changes

- New "Party" button in the UI that opens a create/join room flow
- Room code displayed for sharing (e.g., `SPUNE-ABCD`)
- Song card shows all participants' currently playing tracks, cycling every 5-10 seconds or displaying in a small sidebar
- The mosaic draws from the merged album pool — more participants = more variety

### Chromecast

The Cast sender sends the merged room state to the receiver, same as it does today with single-user data. The receiver doesn't need to know about rooms.

## Considerations

- **Auth**: All room members must be authenticated with Spotify. The server already handles per-user OAuth.
- **Rate limits**: Each room member adds their own Spotify polling load. With 5 users, that's 5x the API calls. Consider reducing poll frequency per user (e.g., 5s instead of 3s) when in a room.
- **Room lifecycle**: Rooms auto-expire after all members leave or after a timeout (e.g., 24 hours).
- **Privacy**: Users can see each other's currently playing track. The join flow should make this clear.
- **Scale**: Rooms are intended for small groups (2-8 people). No need to optimize for large groups.

## Implementation order

1. Room CRUD API + database schema
2. Room join/leave flow in the UI
3. Server-side playback aggregation
4. Client-side merged mosaic rendering
5. Song card cycling between participants
6. Chromecast support for room state
