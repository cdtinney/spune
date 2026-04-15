import { Router, type IRouter, Request, Response } from 'express';
import { spotifyApiWithToken } from '../spotify/api/SpotifyApi';
import apiRequestWithRefresh from '../spotify/api/helpers/apiRequestWithRefresh';
import getCurrentlyPlayingRelatedAlbums from '../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums';
import type { SpotifyAlbum } from '../types';

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown Error';
}

const router: IRouter = Router();

router.get('/currently-playing/related-albums', async (req: Request, res: Response) => {
  const songId = String(req.query.songId || '');
  const { user } = req;

  try {
    res.send(
      await apiRequestWithRefresh<SpotifyAlbum[]>({
        user,
        apiFn: (accessToken: string) => {
          const spotifyApi = spotifyApiWithToken(accessToken);
          return getCurrentlyPlayingRelatedAlbums(spotifyApi, songId);
        },
      }),
    );
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});

router.get('/me/player', async (req: Request, res: Response) => {
  const { user } = req;

  try {
    const result = await apiRequestWithRefresh({
      user,
      apiFn: (accessToken: string) => spotifyApiWithToken(accessToken).player.getPlaybackState(),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});

export default router;
