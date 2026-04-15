'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.pool = void 0;
exports.connect = connect;
exports.disconnect = disconnect;
const pg_1 = require('pg');
const logger_1 = __importDefault(require('../logger'));
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/spune';
const pool = new pg_1.Pool({ connectionString: DATABASE_URL });
exports.pool = pool;
pool.on('error', (err) => {
  logger_1.default.error('[DB] Unexpected pool error', err);
});
async function connect() {
  try {
    const client = await pool.connect();
    client.release();
    logger_1.default.info('[DB] Successfully connected to PostgreSQL');
  } catch (error) {
    logger_1.default.error('[DB] Failed to connect to PostgreSQL');
    logger_1.default.error(error);
  }
}
async function disconnect() {
  await pool.end();
  logger_1.default.info('[DB] Successfully disconnected from PostgreSQL');
}
//# sourceMappingURL=db.js.map
