import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';

import logger from './logger';

import { pool, connect } from './database/db';
import routes from './routes/index';
import paths from './config/paths';
import configurePassport from './auth/configurePassport';

const PgSession = connectPgSimple(session);

export default function createApp(): express.Application {
  const app = express();

  // Trust reverse proxy (Caddy) so Express sees correct protocol/IP
  app.set('trust proxy', 1);

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === 'production',
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
