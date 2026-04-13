const { Pool } = require('pg');
const logger = require('../logger');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/spune';

const pool = new Pool({ connectionString: DATABASE_URL });

pool.on('error', (err) => {
  logger.error('[DB] Unexpected pool error', err);
});

async function connect() {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('[DB] Successfully connected to PostgreSQL');
  } catch (error) {
    logger.error('[DB] Failed to connect to PostgreSQL');
    logger.error(error);
  }
}

async function disconnect() {
  await pool.end();
  logger.info('[DB] Successfully disconnected from PostgreSQL');
}

module.exports = { pool, connect, disconnect };
