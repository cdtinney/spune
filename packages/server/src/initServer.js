const logger = require('./logger');
const { disconnect } = require('./database/db');

module.exports = function initServer(app) {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
    logger.info(`Login:   http://127.0.0.1:${port}/api/auth/spotify`);
    logger.info(`User:    http://127.0.0.1:${port}/api/auth/user`);
    logger.info(`Player:  http://127.0.0.1:${port}/api/spotify/me/player`);
  });

  let shuttingDown = false;
  function gracefulShutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down...`);
    server.close(() => {
      disconnect().finally(() => process.exit(0));
    });
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};
