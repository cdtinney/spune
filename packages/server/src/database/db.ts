import { Pool } from 'pg';
import logger from '../logger';

const DATABASE_URL: string = process.env.DATABASE_URL || 'postgresql://localhost:5432/spune';

const pool = new Pool({ connectionString: DATABASE_URL });

pool.on('error', (err: Error) => {
  logger.error('[DB] Unexpected pool error', err);
});

async function connect(): Promise<void> {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('[DB] Successfully connected to PostgreSQL');
  } catch (error) {
    logger.error('[DB] Failed to connect to PostgreSQL');
    logger.error(error);
  }
}

async function disconnect(): Promise<void> {
  await pool.end();
  logger.info('[DB] Successfully disconnected from PostgreSQL');
}

export { pool, connect, disconnect };
