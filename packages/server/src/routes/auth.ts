import { Router, type IRouter, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import paths from '../config/paths';
import type { User } from '../types';

const SPOTIFY_PERMISSION_SCOPES: string[] = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];

const router: IRouter = Router();

router.get('/user', (req: Request, res: Response) => {
  const user = req.user as User | undefined;
  if (!user) {
    res.json({});
    return;
  }

  res.json({
    user: {
      spotifyId: user.spotifyId,
      displayName: user.displayName,
      photos: user.photos,
    },
  });
});

router.get('/user/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error | null) => {
    if (err) {
      return next(err);
    }
    // Setting to `null` will clear the session in the DB.
    req.session.destroy(() => {});
    res.redirect('/');
  });
});

router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: SPOTIFY_PERMISSION_SCOPES,
  }),
  () => {
    // This route will redirect to Spotify so nothing needs to be done other than
    // calling `passport.authenticate()`.
  },
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', {
    successRedirect: paths.clientHome,
    failureRedirect: paths.clientLogin,
  }),
);

export default router;
