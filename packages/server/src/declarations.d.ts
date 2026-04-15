/* Ambient module declarations for untyped packages */

declare module 'passport-spotify' {
  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback?: boolean;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    profile: SpotifyProfile,
    done: (err: Error | null, user?: unknown) => void,
  ) => void;

  interface SpotifyProfile {
    id: string;
    displayName: string;
    photos: Array<{ value: string }>;
    provider: string;
  }

  class Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    name: string;
    authenticate(req: import('express').Request, options?: object): void;
  }

  export { Strategy, StrategyOptions, VerifyFunction, SpotifyProfile };
}

declare module 'passport-oauth2-refresh' {
  interface PassportOAuth2Refresh {
    use(strategy: { name: string }): void;
    requestNewAccessToken(
      strategyName: string,
      refreshToken: string,
      callback: (err: Error | null, accessToken: string, refreshToken?: string) => void,
    ): void;
  }

  const refresh: PassportOAuth2Refresh;
  export default refresh;
}

declare module 'connect-pg-simple' {
  import type { Store } from 'express-session';
  import type { Pool } from 'pg';

  interface PgStoreOptions {
    pool?: Pool;
    conString?: string;
    conObject?: object;
    tableName?: string;
    schemaName?: string;
    ttl?: number;
    createTableIfMissing?: boolean;
    disableTouch?: boolean;
    pruneSessionInterval?: number | false;
    errorLog?: (error: Error) => void;
  }

  function connectPgSimple(
    session: typeof import('express-session'),
  ): new (options?: PgStoreOptions) => Store;

  export = connectPgSimple;
}
