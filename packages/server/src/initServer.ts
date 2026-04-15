import type { Application } from 'express';
import logger from './logger';
import { disconnect } from './database/db';

export default function initServer(app: Application): void {
  const port: number = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
    logger.info(`Login:   http://127.0.0.1:${port}/api/auth/spotify`);
    logger.info(`User:    http://127.0.0.1:${port}/api/auth/user`);
    logger.info(`Player:  http://127.0.0.1:${port}/api/spotify/me/player`);
  });

  let shuttingDown = false;
  function gracefulShutdown(signal: string): void {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down...`);
    server.close(() => {
      disconnect().finally(() => process.exit(0));
    });
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
