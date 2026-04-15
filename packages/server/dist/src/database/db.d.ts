import { Pool } from 'pg';
declare const pool: Pool;
declare function connect(): Promise<void>;
declare function disconnect(): Promise<void>;
export { pool, connect, disconnect };
