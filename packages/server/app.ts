import path from 'path';
import dotenv from 'dotenv';

// Load .env BEFORE any other imports so all modules see the env vars.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

// Dynamic imports ensure env vars are available when modules load.
async function main() {
  const { default: createApp } = await import('./src/createApp');
  const { default: startServer } = await import('./src/startServer');
  startServer(createApp());
}

main();
