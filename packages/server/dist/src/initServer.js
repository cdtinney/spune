'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = initServer;
const logger_1 = __importDefault(require('./logger'));
const db_1 = require('./database/db');
function initServer(app) {
  const port = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => {
    logger_1.default.info(`Listening on port ${port}`);
    logger_1.default.info(`Login:   http://127.0.0.1:${port}/api/auth/spotify`);
    logger_1.default.info(`User:    http://127.0.0.1:${port}/api/auth/user`);
    logger_1.default.info(`Player:  http://127.0.0.1:${port}/api/spotify/me/player`);
  });
  let shuttingDown = false;
  function gracefulShutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger_1.default.info(`${signal} received, shutting down...`);
    server.close(() => {
      (0, db_1.disconnect)().finally(() => process.exit(0));
    });
  }
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
//# sourceMappingURL=initServer.js.map
