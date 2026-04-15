import { Router, type IRouter, Request, Response } from 'express';
import { playbackBroadcaster } from '../sse/PlaybackBroadcaster';

const router: IRouter = Router();

let clientCounter = 0;

router.get('/playback', (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    res.status(401).send('Not authenticated');
    return;
  }

  const clientId = `sse_${++clientCounter}_${user.spotifyId}`;

  playbackBroadcaster.addClient(clientId, res, user);

  req.on('close', () => {
    playbackBroadcaster.removeClient(clientId);
  });
});

export default router;
