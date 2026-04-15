import type { Response } from 'express';
import { spotifyApiWithToken } from '../spotify/api/SpotifyApi';
import apiRequestWithRefresh from '../spotify/api/helpers/apiRequestWithRefresh';
import logger from '../logger';
import type { User } from '../types';

const POLL_INTERVAL = 3000;

interface PlaybackState {
  item: {
    id: string;
    name: string;
    duration_ms: number;
    artists: Array<{ id: string; name: string }>;
    album: {
      id: string;
      name: string;
      images: Array<{ url: string }>;
      artists: Array<{ id: string; name: string }>;
    };
  } | null;
  progress_ms: number;
  is_playing: boolean;
}

interface SSEClient {
  id: string;
  res: Response;
  user: User;
}

/**
 * Manages SSE connections and broadcasts playback state.
 *
 * Each connected user gets their own polling loop (since playback state
 * is per-user via their Spotify access token). The server polls Spotify
 * on behalf of the user and pushes updates via SSE, eliminating the
 * client-to-server polling overhead.
 */
export class PlaybackBroadcaster {
  private clients: Map<string, SSEClient> = new Map();
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private lastState: Map<string, string> = new Map(); // songId per client

  addClient(id: string, res: Response, user: User): void {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    // Send initial keepalive
    res.write(':ok\n\n');

    this.clients.set(id, { id, res, user });

    // Start polling for this user
    const poll = () => this.pollForClient(id);
    poll(); // immediate first poll
    const timer = setInterval(poll, POLL_INTERVAL);
    this.timers.set(id, timer);

    logger.info(`[SSE] Client connected: ${id} (${this.clients.size} total)`);
  }

  removeClient(id: string): void {
    const timer = this.timers.get(id);
    if (timer) clearInterval(timer);
    this.timers.delete(id);
    this.clients.delete(id);
    this.lastState.delete(id);
    logger.info(`[SSE] Client disconnected: ${id} (${this.clients.size} total)`);
  }

  private async pollForClient(clientId: string): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const data = (await apiRequestWithRefresh({
        user: client.user,
        apiFn: (accessToken: string) =>
          spotifyApiWithToken(accessToken).player.getPlaybackState(),
      })) as PlaybackState | null;

      if (!data) {
        this.sendEvent(client, 'playback', { item: null });
        return;
      }

      const songId = data.item?.id ?? null;
      const lastSongId = this.lastState.get(clientId) ?? null;
      const songChanged = songId !== lastSongId;

      if (songId) {
        this.lastState.set(clientId, songId);
      }

      this.sendEvent(client, 'playback', {
        item: data.item,
        progress_ms: data.progress_ms,
        is_playing: data.is_playing,
        song_changed: songChanged,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.sendEvent(client, 'error', { message });
    }
  }

  private sendEvent(client: SSEClient, event: string, data: unknown): void {
    try {
      client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Client disconnected
      this.removeClient(client.id);
    }
  }
}

export const playbackBroadcaster = new PlaybackBroadcaster();
