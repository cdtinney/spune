import type { PassportStatic } from 'passport';
import serializeUser from './serialization/serializeUser';
import deserializeUser from './serialization/deserializeUser';
import spotifyPassportStrategy from '../spotify/auth/passportStrategy';

export default function configurePassport(passport: PassportStatic): void {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.use(spotifyPassportStrategy() as any);
}
