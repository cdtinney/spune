import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';

import logger from './logger';

import { pool, connect } from './database/db';
import routes from './routes/index';
import paths from './config/paths';
import configurePassport from './auth/configurePassport';
import { verifyTokenEncryptionConfigured } from './auth/tokenCrypto';
import requestContext from './middleware/requestContext';
import httpLogger from './middleware/httpLogger';

const PgSession = connectPgSimple(session);

function resolveSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production.');
  }
  logger.warn('SESSION_SECRET is not set; using an insecure dev fallback.');
  return 'fallback-dev-secret';
}

export default function createApp(): express.Application {
  // Fail fast at boot rather than on first auth attempt.
  verifyTokenEncryptionConfigured();

  const app = express();

  // Trust reverse proxy (Caddy) so Express sees correct protocol/IP
  app.set('trust proxy', 1);

  // Must run before routes so downstream log entries inherit the request ID via AsyncLocalStorage.
  app.use(requestContext);
  app.use(httpLogger);

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const isProd = process.env.NODE_ENV === 'production';
  app.use(
    session({
      secret: resolveSessionSecret(),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: isProd,
        httpOnly: true,
        sameSite: 'lax',
      },
      resave: false,
      saveUninitialized: false,
      // Automatically extends the session age on each request.
      rolling: true,
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      // If `req.session` is unset, destroy the session in the DB.
      unset: 'destroy',
    }),
  );

  // Initialize Passport.js for authentication of users.
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport(passport);

  // Add HTML routes (for production and integration testing).
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production' || nodeEnv === 'integration') {
    logger.info(`Serving static files from ${paths.clientBuildFolder}`);
    // Serve static React files from root.
    app.use('/', express.static(paths.clientBuildFolder));
  }

  // Add API routes.
  app.use('/api', routes);

  // Connect to the DB.
  connect();

  return app;
}
