const logger = require('./logger');

const DEFAULT_PORT = 5000;

module.exports = function initServer(app) {
  const port = process.env.PORT || DEFAULT_PORT;
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};
