const logger = require('./logger');

module.exports = function initServer(app) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};
