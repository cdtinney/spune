import type { PassportStatic } from 'passport';
import serializeUser from './serialization/serializeUser';
import deserializeUser from './serialization/deserializeUser';
import spotifyPassportStrategy from '../spotify/auth/passportStrategy';

export default function configurePassport(passport: PassportStatic): void {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(spotifyPassportStrategy());
}
