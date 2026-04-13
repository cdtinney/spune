const logger = require('./logger');

module.exports = function initServer(app) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
    logger.info(`Login:   http://127.0.0.1:${port}/api/auth/spotify`);
    logger.info(`User:    http://127.0.0.1:${port}/api/auth/user`);
    logger.info(`Player:  http://127.0.0.1:${port}/api/spotify/me/player`);
  });
};
